import { SELECT_FEED, SELECT_ITEM } from './ui'
import { REMOVE_FEED } from './feeds'
import { type Feed, type FeedItem } from '../factories'
import type { RootState } from '../types'

export const MARK_ALL_ITEMS_VIEWED = "MARK_ALL_ITEMS_VIEWED" as const

// Ignore feeds that have languished unread for over 2 weeks.
const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY

const FEED_AGE_LIMIT = 2 * WEEK
const FEED_STALE_LIMIT = 8 * WEEK
const FEED_RECENT_VIEW_LIMIT = 30 * MINUTE

const name = "views" as const

type ViewsState = {
  feedsViewedAt: Record<string, number>
  itemsViewedAt: Record<string, number>
  feedLastViewedAt: number
  itemLastViewedAt: number
}

export type { ViewsState }

export function markAllItemsViewed(feed: Feed) {
  return {
    type: MARK_ALL_ITEMS_VIEWED,
    payload: { feed },
    meta: {
      checkpoint: "Marked all read"
    }
  } as const
}

// Action types derived from action creators
type MarkAllItemsViewedAction = ReturnType<typeof markAllItemsViewed>

// External actions this module responds to
type SelectFeedAction = { type: typeof SELECT_FEED; payload: { feed: Feed } }
type SelectItemAction = { type: typeof SELECT_ITEM; payload: { item: FeedItem } }
type RemoveFeedAction = { type: typeof REMOVE_FEED; payload: { feed: Feed } }

type ViewsAction =
  | MarkAllItemsViewedAction
  | SelectFeedAction
  | SelectItemAction
  | RemoveFeedAction

const initialState: ViewsState = {
  feedsViewedAt: {},
  itemsViewedAt: {},
  feedLastViewedAt: 0,
  itemLastViewedAt: 0,
}

const reducer = (state = initialState, action: ViewsAction): ViewsState => {
  switch (action.type) {
    case SELECT_FEED:
      return selectedFeed(state, action as SelectFeedAction)
    case SELECT_ITEM:
      return selectedItem(state, action as SelectItemAction)
    case REMOVE_FEED:
      return removedFeed(state, action as RemoveFeedAction)
    case MARK_ALL_ITEMS_VIEWED:
      return markedAllItemsViewed(state, action as MarkAllItemsViewedAction)
    default:
      return state
  }
}

function selectedFeed(state: ViewsState, action: SelectFeedAction): ViewsState {
  const feed = action.payload.feed
  const feedsViewedAt = Object.assign({}, state.feedsViewedAt)
  const now = Date.now()
  feedsViewedAt[feed.id] = now

  return {...state, feedsViewedAt, feedLastViewedAt: now}
}

function selectedItem(state: ViewsState, action: SelectItemAction): ViewsState {
  const item = action.payload.item
  const itemsViewedAt = {...state.itemsViewedAt}
  const now = Date.now()
  itemsViewedAt[item.id] = now

  return {...state, itemsViewedAt, itemLastViewedAt: now}
}

function removedFeed(state: ViewsState, action: RemoveFeedAction): ViewsState {
  const feed = action.payload.feed
  const feedsViewedAt = Object.assign({}, state.feedsViewedAt)
  delete feedsViewedAt[feed.id]

  return {...state, feedsViewedAt}
}

function markedAllItemsViewed(state: ViewsState, action: MarkAllItemsViewedAction): ViewsState {
  const feed = action.payload.feed
  const itemsViewedAt = Object.assign({}, state.itemsViewedAt)
  feed.items.forEach(item => itemsViewedAt[item.id] = Date.now())

  return {...state, itemsViewedAt}
}

const selectors = {
  isFeedUnread: (state: RootState, feed: Feed): boolean => {
    const viewedAt = state[name].feedsViewedAt[feed.id] || 0
    return (viewedAt < feed.updatedAt) && (Date.now() - feed.updatedAt < FEED_AGE_LIMIT)
  },

  isItemUnread: (state: RootState, item: FeedItem): boolean => {
    const viewedAt = state[name].itemsViewedAt[item.id] || 0
    return viewedAt < item.createdAt
  },

  isFeedRecent: (state: RootState, feed: Feed): boolean => {
    const viewedAt = state[name].feedsViewedAt[feed.id] || 0
    const now = Date.now()
    if (now - viewedAt < FEED_RECENT_VIEW_LIMIT) return true

    return (viewedAt < feed.updatedAt) && (now - feed.updatedAt < FEED_AGE_LIMIT)
  },

  isFeedStale: (_state: RootState, feed: Feed): boolean => {
    const now = Date.now()
    return (now - feed.updatedAt > FEED_STALE_LIMIT)
  },

  itemLastViewedAt: (state: RootState): number => {
    return state[name].itemLastViewedAt
  },
}

export default {
  name,
  reducer,
  selectors,
  serialize: true,
}