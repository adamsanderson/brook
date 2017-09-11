import { humanizeURL } from '../../util/url'

export const ADD_FEED = "ADD_FEED"
export const REMOVE_FEED = "REMOVE_FEED"
export const FETCH_FEED = "FETCH_FEED"
export const UPDATE_FEED = "UPDATE_FEED"

const name = __filename

export function addFeed(feed) {
  return {
    type: ADD_FEED, 
    payload: { feed: normalizeFeed(feed) }
  }
}

export function removeFeed(feed) {
  return {
    type: REMOVE_FEED, 
    payload: { feed }
  }
}

export function fetchFeed(feed) {
  return {
    type: FETCH_FEED, 
    payload: { feed }
  }
}

export function updateFeed(feed, attributes) {
  return {
    type: UPDATE_FEED, 
    payload: { feed, attributes }
  }
}

const initialState = {
  "1": normalizeFeed({id: "1", title: "MonkeyAndCrow!", url: "http://feeds.feedburner.com/MonkeyAndCrow"}),
  "2": normalizeFeed({id: "2", title: "Codrops", url: "http://feeds2.feedburner.com/tympanus"}),
}

const reducer = (state = initialState, action) => {
  const feed = action.payload && action.payload.feed
  if (!feed) { return state }

  switch (action.type) {
    case ADD_FEED:
      return Object.assign({}, state, {[feed.id]: feed})
    case REMOVE_FEED:
      const s = Object.assign({}, state)
      delete s[feed.id]
      return s
    case UPDATE_FEED:
      const currentFeed = state[feed.id]
      const attributes = action.payload.attributes
      if (!currentFeed) return state

      const newFeed = {...currentFeed, ...attributes}
      return Object.assign({}, state, {[feed.id]: newFeed})
    default:
      return state
  }
}

function normalizeFeed(feed) {
  if (!feed.url) throw new Error("Feeds must have a URL")
  
  return ({
    id: feed.id || Math.random().toString(36).substring(2, 15),
    url: feed.url,
    title: feed.title || humanizeURL(feed.url),
    items: feed.items || [],
    updatedAt: feed.updatedAt || new Date()
  })
}

export default {
  name,
  reducer
}