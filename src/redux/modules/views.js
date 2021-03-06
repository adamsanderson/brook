import { SELECT_FEED, SELECT_ITEM } from './ui'
import { REMOVE_FEED } from './feeds'

export const MARK_ALL_ITEMS_VIEWED = "MARK_ALL_ITEMS_VIEWED"

// Ignore feeds that have languished unread for over 2 weeks.
const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY

const FEED_AGE_LIMIT = 2 * WEEK
const FEED_STALE_LIMIT = 8 * WEEK
const FEED_RECENT_VIEW_LIMIT = 30 * MINUTE

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
  feedLastViewedAt: 0,
  itemLastViewedAt: 0,
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
  const now = Date.now()
  feedsViewedAt[feed.id] = now

  return {...state, feedsViewedAt, feedLastViewedAt: now}
}

function selectedItem(state, action) {
  const item = action.payload.item
  const itemsViewedAt = Object.assign({}, state.itemsViewedAt)
  const now = Date.now()
  itemsViewedAt[item.id] = now
  
  return {...state, itemsViewedAt, itemLastViewedAt: now}
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
  isFeedUnread: (state, feed) => {
    const viewedAt = state[name].feedsViewedAt[feed.id] || 0
    return (viewedAt < feed.updatedAt) && (Date.now() - feed.updatedAt < FEED_AGE_LIMIT)
  },

  isItemUnread: (state, item) => {
    const viewedAt = state[name].itemsViewedAt[item.id] || 0
    return viewedAt < item.createdAt
  },

  isFeedRecent: (state, feed) => {
    const viewedAt = state[name].feedsViewedAt[feed.id] || 0
    const now = Date.now()
    if (now - viewedAt < FEED_RECENT_VIEW_LIMIT) return true

    return (viewedAt < feed.updatedAt) && (now - feed.updatedAt < FEED_AGE_LIMIT)
  },

  isFeedStale: (state, feed) => {
    const now = Date.now()
    return (now - feed.updatedAt > FEED_STALE_LIMIT)
  },

  itemLastViewedAt: (state, item) => {
    return state[name].itemLastViewedAt
  },
}

export default {
  name,
  reducer,
  selectors,
  serialize: true,
}