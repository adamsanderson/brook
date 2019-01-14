import { alias } from 'react-chrome-redux'

import FeedMe from 'feedme'

import feeds, { FETCH_FEED, FETCH_ALL, updateFeed } from '../modules/feeds'
import { resolveUrl } from '../../util/url'
import workers, { finishedFeedWorker, startedFeedWorker } from '../modules/workers'
import { FeedParseError, NetworkError } from '../../util/errors'

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
      return res.text()
    } else {
      throw new NetworkError(`HTTP ${res.status}: Could not access ${feed.url}`)
    }
  })
  .then(body => {
    const parser = new FeedMe(true)

    parser.on('end', function() {
      const feedData = parser.done()
      const attributes = translateFeedData(feedData, feed.url)
      
      dispatch(updateFeed(feed, attributes))
    })

    parser.on('error', function(error) {
      throw new FeedParseError("Could not parse feed", feed.url, body)
    })

    parser.write(body)
    parser.end()

    return {feed}
  })
  .catch(error => {
    dispatch(updateFeed(feed, {error: error.toString()}))

    if (error instanceof FeedParseError) {
      console.warn(error, error.url, error.body)
    } else if (error instanceof NetworkError) {
      console.warn(error, error.url)
    } else {
      throw error
    }
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
  if (typeof link === "string") {
    return link
  } else if (Array.isArray(link)) {
    const alternate = link.find(l => l.rel === "alternate" && l.type === "text/html")
    return alternate.href
  } else if (link.href) {
    return link.href
  }
}

export default alias(aliases)