import { alias } from 'webext-redux'
import FeedMe from 'feedme'
import { uniqBy } from 'lodash'
import type { Dispatch, UnknownAction } from 'redux'

import feeds, { FETCH_FEED, FETCH_ALL, updateFeed } from '../modules/feeds'
import { resolveUrl, findUrls } from '../../util/url'
import workers, { finishedFeedWorker, startedFeedWorker } from '../modules/workers'
import { FeedParseError, NetworkError, DeadFeedError as InvalidContentError } from '../../util/errors'
import { reportError } from '../../util/errorHandler'
import { discoverFeedsFromString } from '../../discoveryStrategies'
import ENV from '../../util/env'
import decodeHtmlEntities from '../../util/decodeHtmlEntities'
import { WP_API } from '../../constants'
import type { Feed, FeedItem, Thunk } from '../types'

// Raw feed data from parser
type RawFeedData = {
  title?: string
  link?: string | { href: string } | Array<{ rel: string; type: string; href: string }>
  'atom:link'?: string | { href: string } | Array<{ rel: string; type: string; href: string }>
  items?: RawFeedItemData[]
}

type RawFeedItemData = {
  id?: string
  title?: string | { type: string; value: string }
  link?: string
  url?: string
  'feedburner:origlink'?: string
  pubdate?: string
  published?: string
  updated?: string
  'dc:date'?: string
}

// WordPress API data
type WordPressPost = {
  guid: { rendered: string }
  title: { rendered: string }
  link: string
  date: string
}

// Action types
type FetchAllAction = { type: typeof FETCH_ALL }
type FetchFeedResult = { feed: Feed } | void
type FetchFeedAction = { type: typeof FETCH_FEED; payload: { feed: Feed }; promise?: Promise<FetchFeedResult> }
type FeedUpdate = Partial<Feed>
type ReduxDispatch = Dispatch<UnknownAction>

const WORKER_COUNT = 8
const FETCH_TIMEOUT = 5 * 1000

const aliases = {
  [FETCH_ALL]: (_action: FetchAllAction): Thunk => {
    return (dispatch, getState) => {
      const state = getState()
      const allFeeds = [...feeds.selectors.allFeeds(state)]

      if (workers.selectors.hasFeedWorkers(state)) return

      // TODO: Make WORKER_COUNT configurable
      for (let i = 0; i < WORKER_COUNT; i++) {
        dispatch(startedFeedWorker())
        fetchFromQueue(allFeeds, dispatch)
      }
    }
  },

  [FETCH_FEED]: (action: FetchFeedAction): FetchFeedAction | Thunk<Promise<FetchFeedResult>> => {
    // If there's a promise, the action has already been kicked off by the background.
    if (action.promise) return action

    const feed = action.payload.feed
    return (dispatch) => fetchFeed(feed, dispatch)
  },
}

function fetchFeed(feed: Feed, dispatch: ReduxDispatch): Promise<FetchFeedResult> {
  const cache = feed.error ? "reload" : "default"
  const headers: Record<string, string> = {}

  // Always refetch feeds that errored out last time.
  if (!feed.error) {
    // When possible avoid getting a resource that has been cached by matching
    // the last know etag or modification date.
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match
    if (feed.etag) {
      headers['If-None-Match'] = feed.etag
    }

    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since
    if (feed.lastFetched) {
      headers['If-Modified-Since'] = new Date(feed.lastFetched).toUTCString()
    }
  }

  const promise = Promise.race<Response>([
    // Fetch feed…
    fetch(feed.url, { cache, headers }),
    // …with a timeout.
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new NetworkError(`Timeout: Site did not respond ${feed.url}`, feed.url)), FETCH_TIMEOUT)
    )
  ])
    .then(res => {
      if (res.status === 304) return { feed }
      if (!res.ok) throw new NetworkError(`HTTP ${res.status}: Could not access ${feed.url}`, feed.url)

      if (feed.format === WP_API) {
        return handleWordpressApi(feed, res, dispatch)
      } else {
        return handleFeed(feed, res, dispatch)
      }
    })
    .catch(error => {
      dispatch(updateFeed(feed, { error: String(error) }))

      // For now, always warn in the console.
      reportError(error)
    })

  dispatch({
    type: FETCH_FEED,
    payload: { feed },
    promise
  })

  return promise
}

function fetchFromQueue(feedQueue: Feed[], dispatch: ReduxDispatch): void {
  window.requestAnimationFrame(() => {
    const feed = feedQueue.shift()
    if (!feed) {
      dispatch(finishedFeedWorker())
      return
    }

    const next = () => fetchFromQueue(feedQueue, dispatch)

    fetchFeed(feed, dispatch).catch((error) => {
      console.warn("Could not fetch feed", feed?.url, error)
    }).finally(next)
  })
}

function handleFeed(feed: Feed, res: Response, dispatch: ReduxDispatch): Promise<{ feed: Feed }> {
  return res.text().then(body => {
    const parser = new FeedMe(true)
    let failed = false

    const attributes: FeedUpdate = {
      etag: res.headers.get("etag") || undefined,
      lastFetched: Date.now(),
    }

    if (res.redirected) {
      attributes.url = res.url
    }

    parser.on('finish', function () {
      if (failed) return

      const feedData = parser.done() || {} as RawFeedData
      const feedAttributes = translateFeedData(feedData, feed.url)

      dispatch(updateFeed(feed, { ...attributes, ...feedAttributes }))
    })

    parser.on('error', function () {
      failed = true
      const contentType = res.headers.get("content-type") || ""
      const url = alternateUrl(feed, body, contentType)

      if (url && url !== feed.url) {
        dispatch(updateFeed(feed, { ...attributes, alternate: { url }, error: "Could not parse feed" }))
      } else {
        if (ENV.development) {
          // In development mode, log any invalid content for debugging.
          // eslint-disable-next-line no-console
          console.info(body)
        }
        if (contentType.indexOf('text/html') === 0) {
          // Eventually feeds die, that's just how the internet it.  In that 
          // case the server may be rendering an html landing page.
          throw new InvalidContentError("Invalid content", feed.url)
        } else {
          // The feed is malformed in some way, or we are handling it wrong.
          throw new FeedParseError("Could not parse feed", feed.url)
        }
      }
    })

    parser.write(body)
    parser.end()

    return { feed }
  })
}

function handleWordpressApi(feed: Feed, res: Response, dispatch: ReduxDispatch): Promise<{ feed: Feed }> {
  return res.json().then((json: WordPressPost[]) => {
    try {
      const attributes: FeedUpdate = {
        etag: res.headers.get("etag") || undefined,
        lastFetched: Date.now(),
      }

      if (res.redirected) {
        attributes.url = res.url
      }

      const feedAttributes = translateWorpressData(json)

      dispatch(updateFeed(feed, { ...attributes, ...feedAttributes }))
    } catch (_error) {
      throw new FeedParseError("Could not parse feed", feed.url)
    }

    return { feed }
  })
}

function translateFeedData(data: RawFeedData, feedUrl: string): FeedUpdate {
  const feed: FeedUpdate = {}

  // Only assign present data, we don't want to override anything with missing data.
  if (data.title) feed.title = data.title
  if (data.link || data?.['atom:link']) feed.linkUrl = chooseUrl(data.link || data['atom:link'])
  if (data.items) feed.items = data.items.map((item) => translateFeedItemData(item, feedUrl))

  // If the same URL is referenced multiple times, only include the first instance
  if (feed.items) feed.items = uniqBy(feed.items, (item => item.url))
  if (feed.items) feed.updatedAt = Math.max(...feed.items.map(f => f.createdAt))
  feed.error = undefined
  feed.alternate = undefined
  return feed
}

function translateFeedItemData(data: RawFeedItemData, feedUrl: string): FeedItem | (FeedItem & { error: string; data: RawFeedItemData }) {
  try {
    const chosenUrl = chooseUrl(data["feedburner:origlink"] || data["link"] || data["url"])
    if (!chosenUrl) throw new Error("Could not resolve item URL")

    const url = resolveUrl(chosenUrl, feedUrl)
    const date = new Date(data.pubdate || data.published || data.updated || data["dc:date"] || "")
    const title = decodeHtmlEntities((typeof data.title === "string") ? data.title : date.toLocaleDateString())

    return {
      id: data.id || url,
      title,
      url,
      createdAt: +date,
    }
  } catch (error) {
    console.error("Error while parsing item from", feedUrl, error, data)
    return {
      id: Math.random().toString(36).substring(2, 15),
      title: '',
      url: '',
      error: error instanceof Error ? error.toString() : String(error),
      createdAt: 0,
      data
    }
  }
}

function translateWorpressData(data: WordPressPost[]): FeedUpdate {
  return ({
    error: undefined,
    alternate: undefined,
    items: data.map(post => ({
      id: post.guid.rendered,
      title: post.title.rendered,
      url: post.link,
      createdAt: + new Date(post.date),
    }))
  })
}

function chooseUrl(link: string | { href: string } | Array<{ rel: string; type: string; href: string }> | undefined): string | undefined {
  if (typeof link === "string") return link
  if (link && typeof link === 'object' && 'href' in link) return link.href

  if (Array.isArray(link)) {
    const alternate = link.find(l => l.rel === "alternate" && l.type === "text/html") || link[0]
    return chooseUrl(alternate)
  }
}

function alternateUrl(feed: Feed, body: string, contentType: string): string | undefined {
  if (contentType.indexOf("text/html") === 0) {
    const feeds = discoverFeedsFromString(body)
    // If there is one feed that has been detected, offer it.
    // Otherwise bail out this is probably not the original author's site anymore.
    return feeds.length === 1 ? feeds[0].url : undefined
  }

  const urls = findUrls(body)
  if (urls && urls.length === 1 && urls[0] !== feed.url) return urls[0]
}

export default alias(aliases)
