import { alias } from 'react-chrome-redux'

import FeedMe from 'feedme';

import feeds, { FETCH_FEED, updateFeed, addFeed } from '../modules/feeds'
import { addFolder } from '../modules/folders'
import { UI_SELECT_FEED, SELECT_FEED } from '../modules/ui'
import { IMPORT_OPML } from '../modules/import'
import OpmlReader from '../../lib/OpmlReader'

const aliases = {
  UI_SELECT_FEED: (action) => {
    const feed = action.payload.feed
    return (dispatch) => {
      dispatch({type: FETCH_FEED, payload: { feed }})
      dispatch({type: SELECT_FEED, payload: { feed }})
    }
  },

  FETCH_ALL: (action) => {
    return (dispatch, getState) => {
      const allFeeds = feeds.selectors.allFeeds(getState())
      // TODO: This will fetch feeds one at a time, adding more calls to
      // `fetchAll` should trivially queue up more workers.
      fetchAll(allFeeds, dispatch)
    }
  },

  FETCH_FEED: (action) => {
    // If there's a promise, the action has already been handled.
    if (action.promise) return action

    const feed = action.payload.feed
    return (dispatch) => fetchFeed(feed, dispatch)
  },

  IMPORT_OPML: (action) => {
    const xml = action.payload.xml

    return function(dispatch, getState) {
      const reader = new OpmlReader({
        onFeed: (feed, parentId) => dispatch(addFeed(feed, parentId)),
        onFolder: (folder, parentId) => dispatch(addFolder(folder, parentId)),
      })
  
      reader.read(xml)
    }
  }
}

function fetchFeed(feed, dispatch) {
  const promise = fetch(feed.url)
  .then(res => res.text())
  .then(body => {
    const parser = new FeedMe(true)

    parser.on('end', function() {
      const feedData = parser.done()
      const attributes = translateFeedData(feedData)

      console.debug("Full Feed", feedData)
      
      dispatch(updateFeed(feed, attributes))
    })

    parser.write(body)
    parser.end()

    return body
  })
  .catch(error => {
    console.error(error)
    throw error
  })

  dispatch({
    type: FETCH_FEED, 
    payload: { feed }, 
    promise
  })

  return promise
}

function fetchAll(allFeeds, dispatch) {
  const feed = allFeeds.pop()
  if (feed) fetchFeed(feed, dispatch).then(() => fetchAll(allFeeds, dispatch))
}

function translateFeedData(data) {
  const feed = {}
  // Only assign present data, we don't want to override anything with missing data.
  if (data.title) feed.title = data.title
  if (data.items) feed.items = data.items.map(translateItemData)
  if (feed.items) feed.updatedAt = Math.max(...feed.items.map(f => f.createdAt))

  return feed
}

function translateItemData(data) {
  return {
    id: data.id || data["feedburner:origlink"] || data["link"],
    title: data.title,
    url: chooseItemUrl(data["feedburner:origlink"] || data["link"]),
    createdAt: +new Date(data.pubdate || data.published),
    description: data.description,
  }
}

function chooseItemUrl(link) {
  let url

  if (typeof link === "string") {
    url = link
  } else if (Array.isArray(link)) {
    const alternate = link.find(l => l.rel === "alternate" && l.type === "text/html")
    url = alternate.href
  }

  return url
}

export default alias(aliases)