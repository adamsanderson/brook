import { alias } from 'react-chrome-redux'

import FeedMe from 'feedme'

import feeds, { FEED, FETCH_FEED, FETCH_ALL, updateFeed, addFeed, removeFeed } from '../modules/feeds'
import folders, { FOLDER, REMOVE_BRANCH, addFolder, removeFolder } from '../modules/folders'
import { UI_SELECT_FEED, SELECT_FEED } from '../modules/ui'
import { IMPORT_OPML } from '../modules/import'
import { UI_SHOW, backendShowToast } from '../modules/toast'
import { startBatch, endBatch } from '../checkpoint'
import OpmlReader from '../../lib/OpmlReader'
import { resolveUrl } from '../../util/url'

const WORKER_COUNT = 4

const aliases = {
  [UI_SELECT_FEED]: (action) => {
    const feed = action.payload.feed
    return (dispatch, getState) => {
      dispatch({type: FETCH_FEED, payload: { feed }})
      dispatch({type: SELECT_FEED, payload: { feed }})
    }
  },

  [REMOVE_BRANCH]: (action) => {
    return (dispatch, getState) => {
      dispatch(startBatch("Deleted folder"))
      const state = getState()
      removeRecursively(action.payload.folder)
      dispatch(endBatch())

      function removeRecursively(node) {
        if (node.type === FEED) {
          dispatch(removeFeed(node))
        } else if (node.type === FOLDER) {
          dispatch(removeFolder(node))
          folders.selectors.getChildren(state, node).forEach(n => removeRecursively(n))
        }
      }
    }
  },

  [FETCH_ALL]: (action) => {
    return (dispatch, getState) => {
      const allFeeds = feeds.selectors.allFeeds(getState())
      
      // TODO: Make WORKER_COUNT configurable
      for (let i = 0; i < WORKER_COUNT; i++) {
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

  [IMPORT_OPML]: (action) => {
    const xml = action.payload.xml

    return function(dispatch, getState) {
      const reader = new OpmlReader({
        onFeed: (feed, parentId) => dispatch(addFeed(feed, parentId)),
        onFolder: (folder, parentId) => dispatch(addFolder(folder, parentId)),
      })
  
      reader.read(xml)
    }
  },

  [UI_SHOW]: (action) => {
    return backendShowToast(action)
  }

}

function fetchFeed(feed, dispatch) {
  const cache = feed.error ? "reload" : "default"
  const promise = fetch(feed.url, { cache })
  .then(res => {
    if (res.ok) {
      return res.text()
    } else {
      throw new Error(`${res.status}: Could not access ${feed.url}`)
    }
  })
  .then(body => {
    const parser = new FeedMe(true)

    parser.on('end', function() {
      const feedData = parser.done()
      const attributes = translateFeedData(feedData, feed.url)
      
      dispatch(updateFeed(feed, attributes))
    })

    parser.write(body)
    parser.end()

    return {feed}
  })
  .catch(error => {
    console.error("Error while fetching feed from", feed.url, error)
    dispatch(updateFeed(feed, {error: error.toString()}))
    throw error
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
    if (!feed) return

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
    let url = chooseItemUrl(data["feedburner:origlink"] || data["link"])
    
    url = resolveUrl(url, feedUrl)
    
    return {
      id: data.id || url,
      title: data.title,
      url,
      createdAt: +new Date(data.pubdate || data.published || data.updated || data["dc:date"]),
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