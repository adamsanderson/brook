import { SELECT_FEED, SELECT_ITEM } from './ui'

const name = __filename

const initialState = {
  feedsViewedAt: {},
  itemsViewedAt: {},
}

const reducer = (state = initialState, action) => {  
  switch (action.type) {
    case SELECT_FEED:
      const feed = action.payload.feed
      const feedsViewedAt = Object.assign({}, state.feedsViewedAt)
      feedsViewedAt[feed.id] = Date.now()
      return {...state, feedsViewedAt}
    case SELECT_ITEM:
      const item = action.payload.item
      const itemsViewedAt = Object.assign({}, state.itemsViewedAt)
      itemsViewedAt[item.id] = Date.now()
      return {...state, itemsViewedAt}
    default:
      return state
  }
}

const selectors = {
  isFeedUnread: (state) => {
    return (feed) => {
      const viewedAt = state[name].feedsViewedAt[feed.id] || 0
      return viewedAt < feed.updatedAt
    }
  },
  isItemUnread: (state) => {
    return (item) => {
      const viewedAt = state[name].itemsViewedAt[item.id] || 0
      return viewedAt < item.createdAt
    }
  },
}

export default {
  name,
  reducer,
  selectors
}