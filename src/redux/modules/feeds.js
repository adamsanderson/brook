import { humanizeURL } from '../../util/url'

export const ADD_FEED = "ADD_FEED"
export const REMOVE_FEED = "REMOVE_FEED"
export const FETCH_FEED = "FETCH_FEED"
export const FETCH_ALL = "FETCH_ALL"
export const UPDATE_FEED = "UPDATE_FEED"

export const FEED = "FEED"

const name = "feeds"

export function addFeed(feed, parentId) {
  return {
    type: ADD_FEED, 
    payload: { feed: normalizeFeed(feed), parentId }
  }
}

export function removeFeed(feed) {
  return {
    type: REMOVE_FEED, 
    payload: { feed },
    meta: {
      checkpoint: "Deleted feed"
    }
  }
}

export function fetchFeed(feed) {
  return {
    type: FETCH_FEED, 
    payload: { feed }
  }
}

export function fetchAll() {
  return {
    type: FETCH_ALL, 
    payload: { }
  }
}

export function updateFeed(feed, attributes) {
  return {
    type: UPDATE_FEED, 
    payload: { feed, attributes }
  }
}

const initialState = {}

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
      return feedUpdated(state, feed, action.payload.attributes)
      
    case FETCH_FEED: 
      return feedUpdated(state, feed, {isLoading: !action.ready})

    default:
      return state
  }
}

function feedUpdated(state, feed, attributes) {
  const currentFeed = state[feed.id]
  if (!currentFeed) return state

  const newFeed = {...currentFeed, ...attributes}

  return Object.assign({}, state, {[feed.id]: newFeed})
}

const selectors = {
  allFeeds: (state) => {
    return Object.values(state[name])
  },
  getFeedById: (state) => {
    return (id) => state[name][id]
  }
}

function normalizeFeed(feed) {
  if (!feed.url) throw new Error("Feeds must have a URL")
  
  return ({
    id: feed.id || Math.random().toString(36).substring(2, 15),
    type: FEED,
    isLoading: !!feed.isLoading,
    url: feed.url,
    title: feed.title || humanizeURL(feed.url),
    items: feed.items || [],
    updatedAt: feed.updatedAt || 0
  })
}

export default {
  name,
  reducer,
  selectors,
  serialize: true,
}