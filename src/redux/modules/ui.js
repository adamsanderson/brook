import feeds, { REMOVE_FEED } from './feeds'

export const SELECT_FEED = "SELECT_FEED"
export const UI_SELECT_FEED = "UI_SELECT_FEED"

export const SELECT_ITEM = "SELECT_ITEM"

const name = __filename

export function selectFeed(feed) {
  return {
    type: UI_SELECT_FEED,
    payload: { feed }
  }
}

export function selectItem(item) {
  return {
    type: SELECT_ITEM,
    payload: { item }
  }
}

const initialState = {
  selectedFeedId: undefined,
}

const reducer = (state = initialState, action) => {  
  switch (action.type) {
    case SELECT_FEED:
      return { ...state, selectedFeedId: action.payload.feed.id }
    case REMOVE_FEED: 
      const feed = action.payload.feed
      return feed.id === state.selectedFeedId 
        ? { ...state, selectedFeedId: undefined } 
        : state
    default:
      return state
  }
}

const selectors = {
  currentFeed: (state) => {
    const id = state[name].selectedFeedId
    return state[feeds.name][id]
  },

  currentItems: (state) => {
    const feed = selectors.currentFeed(state)
    return (feed && feed.items) || []
  }
}

export default {
  name,
  reducer,
  selectors
}