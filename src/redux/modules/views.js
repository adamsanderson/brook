import ui, { SELECT_FEED, SELECT_ITEM } from './ui'
import { REMOVE_FEED, FEED } from './feeds'

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
  // TODO: Return state, not function
  isFeedUnread: (state) => {
    return (feed) => {
      const viewedAt = state[name].feedsViewedAt[feed.id] || 0
      return (viewedAt < feed.updatedAt) && (Date.now() - feed.updatedAt < FEED_AGE_LIMIT)
    }
  },
  // TODO: Return state, not function
  isItemUnread: (state) => {
    return (item) => {
      const viewedAt = state[name].itemsViewedAt[item.id] || 0
      return viewedAt < item.createdAt
    }
  },

  isFeedRecent: (state, feed) => {
    const viewedAt = state[name].feedsViewedAt[feed.id] || 0
    const now = Date.now()
    if (now - viewedAt < FEED_RECENT_VIEW_LIMIT) return true
    return (viewedAt < feed.updatedAt) && (now - feed.updatedAt < FEED_AGE_LIMIT)
  },

  nextFeed: (state, currentFeed, filter=selectors.isFeedRecent) => {
    const feedList = ui.selectors.getNodeList(state)
      .filter(node => node.item.type === FEED)
      .map(node => node.item)
    const index = feedList.findIndex(feed => feed.id === currentFeed.id)

    if (index === -1) return undefined

    const candidates = feedList.slice(index + 1).concat(feedList.slice(0, index - 1))

    return candidates.find(feed => filter(state, feed))
  },

  isFeedStale: (state, feed) => {
    const now = Date.now()
    return (now - feed.updatedAt > FEED_STALE_LIMIT)
  }
}

export default {
  name,
  reducer,
  selectors,
  serialize: true,
}