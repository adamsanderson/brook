import feeds from "./feeds"

export const FOUND_FEEDS = "FOUND_FEEDS"
export const FORGET_FEEDS = "FORGET_FEEDS"

const name = "discovery"

export function foundFeeds(feeds) {
  return {
    type: FOUND_FEEDS, 
    payload: { feeds }
  }
}

export function forgetFeeds(tabId) {
  return {
    type: FORGET_FEEDS, 
    payload: { tabId }
  }
}

const initialState = {
  feeds: {},
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FOUND_FEEDS:
      return reduceFoundFeeds(state, action)
    case FORGET_FEEDS:
      return reduceForgetFeeds(state, action)
  }

  return state
}

function reduceFoundFeeds(state, action) {
  return { ...state, 
    feeds: { ...state.feeds, 
      [action._sender.tab.id]: action.payload.feeds
    } 
  }
}

function reduceForgetFeeds(state, action) {
  const tabId = action.payload.tabId
  let feeds = Object.assign({}, state.feeds)
  delete feeds[tabId || action._sender.tab.id]

  return { ...state, feeds }
}

const selectors = {
  availableFeeds: (state, tabId) => {
    return state[name].feeds[tabId] || []
  },
  hasAvailableFeeds: (state, tabId) => {
    return selectors.availableFeeds(state, tabId).length > 0
  },
  unsubscribedFeeds: (state, tabId) => {
    const availableFeeds = selectors.availableFeeds(state, tabId)
    if (availableFeeds.length === 0) return []

    const allFeedsByUrl = feeds.selectors.allFeedsByUrl(state)
    return availableFeeds.filter(feed => !allFeedsByUrl[feed.url])
  },
}

export default {
  name,
  reducer,
  selectors,
}