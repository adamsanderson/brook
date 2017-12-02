export const FOUND_FEEDS = "FOUND_FEEDS"
export const FORGET_FEEDS = "FORGET_FEEDS"

const name = __filename

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
      return { ...state, 
        feeds: { ...state.feeds, 
          [action._sender.tab.id]: action.payload.feeds
        } 
      }
    case FORGET_FEEDS:
      let feeds = Object.assign({}, state.feeds)
      delete feeds[action._sender.tab.id]

      return { ...state, feeds }
  }

  return state
}

const selectors = {
  availableFeeds: (state, tabId) => {
    return state[name].feeds[tabId] || []
  }
}

export default {
  name,
  reducer,
  selectors,
}