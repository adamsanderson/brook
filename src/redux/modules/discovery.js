export const FOUND_FEEDS = "FOUND_FEEDS"
export const FORGET_FEEDS = "FORGET_FEEDS"

const name = "discovery"

export function foundFeeds(feeds) {
  return {
    type: FOUND_FEEDS, 
    payload: { feeds }
  }
}

export function forgetFeeds() {
  return {
    type: FORGET_FEEDS, 
    payload: { }
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
  let feeds = Object.assign({}, state.feeds)
  delete feeds[action._sender.tab.id]

  return { ...state, feeds }
}

const selectors = {
  availableFeeds: (state, tabId) => {
    return state[name].feeds[tabId] || []
  },
  hasAvailableFeeds: (state, tabId) => {
    return selectors.availableFeeds(state, tabId).length > 0
  }
}

export default {
  name,
  reducer,
  selectors,
}