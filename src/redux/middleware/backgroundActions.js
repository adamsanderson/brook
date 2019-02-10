import { alias } from 'react-chrome-redux'

import FeedMe from 'feedme'

import feeds, { FETCH_FEED, FETCH_ALL, updateFeed } from '../modules/feeds'
import { resolveUrl, findUrls } from '../../util/url'
import workers, { finishedFeedWorker, startedFeedWorker } from '../modules/workers'
import { FeedParseError, NetworkError, DeadFeedError as InvalidContentError } from '../../util/errors'
import { reportError } from '../../util/errorHandler'
import { discoverFeedsFromString } from '../../discoveryStrategies'

const WORKER_COUNT = 4
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

  const promise = Promise.race([
    // Fetch feed…
    fetch(feed.url, { cache }),
    // …with a timeout.
    new Promise((_, reject) =>
      setTimeout(() => reject(new NetworkError(`Timeout: Site did not respond ${feed.url}`)), FETCH_TIMEOUT)
    )
  ])
  .then(res => {
    if (res.ok) {
      return res
    } else {
      throw new NetworkError(`HTTP ${res.status}: Could not access ${feed.url}`)
    }
  })
  .then((res) => {
    return res.text().then(body => {
      const parser = new FeedMe(true)
      let failed = false

      parser.on('end', function() {
        if (failed) return

        const feedData = parser.done()
        const attributes = translateFeedData(feedData, feed.url)
        
        dispatch(updateFeed(feed, attributes))
      })

      parser.on('error', function(error) {
        failed = true
        const contentType = res.headers.get("content-type")
        const url = alternateUrl(feed, body, contentType)
        
        if (url) {
          dispatch(updateFeed(feed, {alternate: {url}, error: "Could not parse feed"}))
        } else {
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

      return {feed}
    })
  })
  .catch(error => {
    dispatch(updateFeed(feed, {error: error.toString()}))

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

function translateFeedData(data, feedUrl) {
  const feed = {}
  
  // Only assign present data, we don't want to override anything with missing data.
  if (data.title) feed.title = data.title
  if (data.items) feed.items = data.items.map((item) => translateItemData(item, feedUrl))
  if (feed.items) feed.updatedAt = Math.max(...feed.items.map(f => f.createdAt))
  feed.error = undefined
  feed.alternate = undefined
  return feed
}

function translateItemData(data, feedUrl) {
  try {
    const url = resolveUrl(chooseItemUrl(data["feedburner:origlink"] || data["link"]), feedUrl)
    const date = new Date(data.pubdate || data.published || data.updated || data["dc:date"])
    const title = (typeof data.title === "string") ? data.title : date.toLocaleDateString()
    
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

function chooseItemUrl(link) {
  if (typeof link === "string") return link
  if (link.href) return link.href

  if (Array.isArray(link)) {
    const alternate = link.find(l => l.rel === "alternate" && l.type === "text/html") || link[0]
    return chooseItemUrl(alternate)
  }
}

function alternateUrl(feed, body, contentType) {
  if (contentType.indexOf("text/html" === 0)) {
    const feeds = discoverFeedsFromString(body)
    if (feeds.length === 1) return feeds[0].url
  }

  const urls = findUrls(body)
  if (urls.length === 1 && urls[0] !== feed) return urls[0]
}

export default alias(aliases)