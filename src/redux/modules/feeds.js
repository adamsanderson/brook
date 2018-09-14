import { buildFeed } from "../factories"

export const ADD_FEED = "ADD_FEED"
export const REMOVE_FEED = "REMOVE_FEED"
export const FETCH_FEED = "FETCH_FEED"
export const FETCH_ALL = "FETCH_ALL"
export const UPDATE_FEED = "UPDATE_FEED"

export const FEED = "FEED"

const name = "feeds"

export function addFeed(feed, { parentId } = {}) {
  return {
    type: ADD_FEED, 
    payload: { feed: buildFeed(feed), parentId }
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
      return reduceRemoveFeed(state, feed)

    case UPDATE_FEED:
      return reduceFeedUpdate(state, feed, action.payload.attributes)
      
    case FETCH_FEED: 
      return reduceFeedUpdate(state, feed, {isLoading: !action.ready})

    default:
      return state
  }
}

function reduceRemoveFeed(state, feed) {
  const nextState = Object.assign({}, state)
  delete nextState[feed.id]
  return nextState
}

function reduceFeedUpdate(state, feed, attributes) {
  const currentFeed = state[feed.id]
  if (!currentFeed) return state

  const newFeed = {...currentFeed, ...attributes}

  return Object.assign({}, state, {[feed.id]: newFeed})
}

const selectors = {
  allFeeds: (state) => {
    return Object.values(state[name])
  },
  allFeedsByUrl: (state) => {
    const feedsByUrl = {}
    const allFeeds = selectors.allFeeds(state)
    
    allFeeds.forEach((feed) => {
      feedsByUrl[feed.url] = feed
    })

    return feedsByUrl
  },
  getFeedById: (state) => {
    return (id) => state[name][id]
  }
}

export default {
  name,
  reducer,
  selectors,
  serialize: true,
}