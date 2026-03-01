import feeds from "./feeds"
import type { RootState, WebExtAction, FeedInput } from '../types'

export const FOUND_FEEDS = "FOUND_FEEDS" as const
export const FORGET_FEEDS = "FORGET_FEEDS" as const

const name = "discovery" as const

type DiscoveryState = {
  feeds: Record<number, FeedInput[]>
}

export type { DiscoveryState }

export function foundFeeds(feeds: FeedInput[]) {
  return {
    type: FOUND_FEEDS,
    payload: { feeds }
  } as const
}

export function forgetFeeds(tabId?: number) {
  return {
    type: FORGET_FEEDS,
    payload: { tabId }
  } as const
}

// Action types derived from action creators
type FoundFeedsAction = ReturnType<typeof foundFeeds> & WebExtAction
type ForgetFeedsAction = ReturnType<typeof forgetFeeds> & WebExtAction

type DiscoveryAction = FoundFeedsAction | ForgetFeedsAction

const initialState: DiscoveryState = {
  feeds: {},
}

const reducer = (state = initialState, action: DiscoveryAction): DiscoveryState => {
  switch (action.type) {
    case FOUND_FEEDS:
      return reduceFoundFeeds(state, action as FoundFeedsAction)
    case FORGET_FEEDS:
      return reduceForgetFeeds(state, action as ForgetFeedsAction)
    default:
      return state
  }
}

function reduceFoundFeeds(state: DiscoveryState, action: FoundFeedsAction): DiscoveryState {
  return { ...state,
    feeds: { ...state.feeds,
      [action._sender.tab.id]: action.payload.feeds
    }
  }
}

function reduceForgetFeeds(state: DiscoveryState, action: ForgetFeedsAction): DiscoveryState {
  const tabId = action.payload.tabId
  const feeds = Object.assign({}, state.feeds)
  delete feeds[tabId || action._sender.tab.id]

  return { ...state, feeds }
}

const selectors = {
  availableFeeds: (state: RootState, tabId: number): FeedInput[] => {
    return state[name].feeds[tabId] || []
  },
  hasAvailableFeeds: (state: RootState, tabId: number): boolean => {
    return selectors.availableFeeds(state, tabId).length > 0
  },
  unsubscribedFeeds: (state: RootState, tabId: number): FeedInput[] => {
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