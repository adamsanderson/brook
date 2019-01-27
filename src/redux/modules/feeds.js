import { buildFeed } from "../factories"

export const ADD_FEED = "ADD_FEED"
export const REMOVE_FEED = "REMOVE_FEED"
export const FETCH_FEED = "FETCH_FEED"
export const FETCH_ALL = "FETCH_ALL"
export const UPDATE_FEED = "UPDATE_FEED"

export const FEED = "FEED"

const name = "feeds"

export function addFeed(feed, { parentId, fetch } = {}) {
  return (dispatch, _getState) => {
    feed = buildFeed(feed)

    dispatch({
      type: ADD_FEED,
      payload: {
        feed,
        parentId
      }
    })

    if (fetch) {
      dispatch(fetchFeed(feed))
    }
  }
}

export function useAlternateFeed(feed) {
  return (dispatch, getState) => {
    dispatch({
      type: UPDATE_FEED, 
      payload: { 
        feed, 
        attributes: {
          ...feed.alternate,
          error: undefined,
          alternate: undefined,
        }
      },
      meta: {
        checkpoint: "Updated feed"
      }
    })

    // Fetch from the new feed to show updates to the user
    dispatch(fetchFeed({...feed, ...feed.alternate}))
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

  if (attributes.error) {
    const newFeed = {...currentFeed, ...attributes, isLoading: false}
    return Object.assign({}, state, {[feed.id]: newFeed})
  } else {
    const newFeed = {...currentFeed, ...attributes}
    return Object.assign({}, state, {[feed.id]: newFeed})
  }
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
  getFeedById: (state, id) => {
    return state[name][id]
  }
}

export default {
  name,
  reducer,
  selectors,
  serialize: true,
}