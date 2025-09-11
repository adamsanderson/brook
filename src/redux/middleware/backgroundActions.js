import { alias } from 'webext-redux'

import FeedMe from 'feedme'

import feeds, { FETCH_FEED, FETCH_ALL, updateFeed } from '../modules/feeds'
import { resolveUrl, findUrls } from '../../util/url'
import workers, { finishedFeedWorker, startedFeedWorker } from '../modules/workers'
import { FeedParseError, NetworkError, DeadFeedError as InvalidContentError } from '../../util/errors'
import { reportError } from '../../util/errorHandler'
import { discoverFeedsFromString } from '../../discoveryStrategies'
import ENV from '../../util/env'
import { uniqBy } from 'lodash'
import decodeHtmlEntities from '../../util/decodeHtmlEntities'
import { WP_API } from '../../constants'

const WORKER_COUNT = 8
const FETCH_TIMEOUT = 5 * 1000

const aliases = {
  [FETCH_ALL]: (action) => {
    return (dispatch, getState) => {
      const state = getState()
      const allFeeds = feeds.selectors.allFeeds(state)

      if (workers.selectors.hasFeedWorkers(state)) return

      // TODO: Make WORKER_COUNT configurable
      for (let i = 0; i < WORKER_COUNT; i++) {
        dispatch(startedFeedWorker())
        fetchFromQueue(allFeeds, dispatch)
      }
    }
  },

  [FETCH_FEED]: (action) => {
    // If there's a promise, the action has already been kicked off by the background.
    if (action.promise) return action

    const feed = action.payload.feed
    return (dispatch) => fetchFeed(feed, dispatch)
  },
}

function fetchFeed(feed, dispatch) {
  const cache = feed.error ? "reload" : "default"
  const headers = {}

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

  const promise = Promise.race([
    // Fetch feed…
    fetch(feed.url, { cache, headers }),
    // …with a timeout.
    new Promise((_, reject) =>
      setTimeout(() => reject(new NetworkError(`Timeout: Site did not respond ${feed.url}`)), FETCH_TIMEOUT)
    )
  ])
    .then(res => {
      if (res.status === 304) return { feed }
      if (!res.ok) throw new NetworkError(`HTTP ${res.status}: Could not access ${feed.url}`)

      if (feed.format === WP_API) {
        return handleWordpressApi(feed, res, dispatch)
      } else {
        return handleFeed(feed, res, dispatch)
      }
    })
    .catch(error => {
      dispatch(updateFeed(feed, { error: error.toString() }))

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

function fetchFromQueue(feedQueue, dispatch) {
  window.requestAnimationFrame(() => {
    const feed = feedQueue.shift()
    if (!feed) {
      dispatch(finishedFeedWorker())
      return
    }

    const next = () => fetchFromQueue(feedQueue, dispatch)

    fetchFeed(feed, dispatch).finally(next)
  })
}

function handleFeed(feed, res, dispatch) {
  return res.text().then(body => {
    const parser = new FeedMe(true)
    let failed = false

    const attributes = {
      etag: res.headers.get("etag"),
      lastFetched: Date.now(),
    }

    if (res.redirected) {
      attributes.url = res.url
    }

    parser.on('finish', function () {
      if (failed) return

      const feedData = parser.done()
      const feedAttributes = translateFeedData(feedData, feed.url)

      dispatch(updateFeed(feed, { ...attributes, ...feedAttributes }))
    })

    parser.on('error', function (error) {
      failed = true
      const contentType = res.headers.get("content-type")
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

function handleWordpressApi(feed, res, dispatch) {
  return res.json().then(json => {
    try {
      const attributes = {
        etag: res.headers.get("etag"),
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

function translateFeedData(data, feedUrl) {
  const feed = {}

  // Only assign present data, we don't want to override anything with missing data.
  if (data.title) feed.title = data.title
  if (data.link || data['atom:link']) feed.linkUrl = chooseUrl(data.link || data['atom:link'])
  if (data.items) feed.items = data.items.map((item) => translateFeedItemData(item, feedUrl))

  // If the same URL is referenced multiple times, only include the first instance
  if (feed.items) feed.items = uniqBy(feed.items, (item => item.url))
  if (feed.items) feed.updatedAt = Math.max(...feed.items.map(f => f.createdAt))
  feed.error = undefined
  feed.alternate = undefined
  return feed
}

function translateFeedItemData(data, feedUrl) {
  try {
    const url = resolveUrl(chooseUrl(data["feedburner:origlink"] || data["link"] || data["url"]), feedUrl)
    const date = new Date(data.pubdate || data.published || data.updated || data["dc:date"])
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
      error: error.toString(),
      createdAt: 0,
      data
    }
  }
}

function translateWorpressData(data) {
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

function chooseUrl(link) {
  if (typeof link === "string") return link
  if (link.href) return link.href

  if (Array.isArray(link)) {
    const alternate = link.find(l => l.rel === "alternate" && l.type === "text/html") || link[0]
    return chooseUrl(alternate)
  }
}

function alternateUrl(feed, body, contentType) {
  if (contentType.indexOf("text/html" === 0)) {
    const feeds = discoverFeedsFromString(body)
    // If there is one feed that has been detected, offer it.
    // Otherwise bail out this is probably not the original author's site anymore.
    return feeds.length === 1 ? feeds[0].url : undefined
  }

  const urls = findUrls(body)
  if (urls.length === 1 && urls[0] !== feed) return urls[0]
}

export default alias(aliases)