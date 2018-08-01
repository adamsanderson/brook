import { SELECT_FEED, SELECT_ITEM } from './ui'
import { REMOVE_FEED } from './feeds'

export const MARK_ALL_ITEMS_VIEWED = "MARK_ALL_ITEMS_VIEWED"

// Ignore feeds that have languished unread for over 2 weeks.
const WEEK = 7 * 24 * 60 * 60 * 1000
const FEED_AGE_LIMIT = 2 * WEEK

const name = "views"

export function markAllItemsViewed(feed) {
  return {
    type: MARK_ALL_ITEMS_VIEWED,
    payload: { feed },
    meta: {
      checkpoint: "Marked all read"
    }
  }
}

const initialState = {
  feedsViewedAt: {},
  itemsViewedAt: {},
}

const reducer = (state = initialState, action) => {  
  switch (action.type) {
    case SELECT_FEED:
      return selectedFeed(state, action)
    case SELECT_ITEM:
      return selectedItem(state, action)
    case REMOVE_FEED:
      return removedFeed(state, action)
    case MARK_ALL_ITEMS_VIEWED:
      return markedAllItemsViewed(state, action)
    default:
      return state
  }
}

function selectedFeed(state, action) {
  const feed = action.payload.feed
  const feedsViewedAt = Object.assign({}, state.feedsViewedAt)
  feedsViewedAt[feed.id] = Date.now()
  
  return {...state, feedsViewedAt}
}

function selectedItem(state, action) {
  const item = action.payload.item
  const itemsViewedAt = Object.assign({}, state.itemsViewedAt)
  itemsViewedAt[item.id] = Date.now()
  return {...state, itemsViewedAt}
}

function removedFeed(state, action) {
  const feed = action.payload.feed
  const feedsViewedAt = Object.assign({}, state.feedsViewedAt)
  delete feedsViewedAt[feed.id]
  return {...state, feedsViewedAt}
}

function markedAllItemsViewed(state, action) {
  const feed = action.payload.feed
  const itemsViewedAt = Object.assign({}, state.itemsViewedAt)
  feed.items.forEach(item => itemsViewedAt[item.id] = Date.now())
  
  return {...state, itemsViewedAt}
}

const selectors = {
  isFeedUnread: (state) => {
    return (feed) => {
      const viewedAt = state[name].feedsViewedAt[feed.id] || 0
      return (viewedAt < feed.updatedAt) && (Date.now() - feed.updatedAt < FEED_AGE_LIMIT)
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
  selectors,
  serialize: true,
}