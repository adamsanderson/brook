import { buildFeed } from "../factories"
import type { RootState, Thunk, Feed, FeedInput } from "../types"

export const ADD_FEED = "ADD_FEED" as const
export const REMOVE_FEED = "REMOVE_FEED" as const
export const RENAME_FEED = "RENAME_FEED" as const
export const FETCH_FEED = "FETCH_FEED" as const
export const FETCH_ALL = "FETCH_ALL" as const
export const EDIT_FEED = "EDIT_FEED" as const
export const UPDATE_FEED = "UPDATE_FEED" as const

export const FEED = "FEED" as const

const name = "feeds" as const

type FeedsState = Record<string, Feed>

export type { FeedsState }

export function addFeed(
  feed: FeedInput,
  { parentId, fetch }: { parentId?: string; fetch?: boolean } = {}
): Thunk {
  return (dispatch, _getState) => {
    const builtFeed = buildFeed(feed)

    dispatch({
      type: ADD_FEED,
      payload: {
        feed: builtFeed,
        parentId
      }
    })

    if (fetch) {
      dispatch(fetchFeed(builtFeed))
    }
  }
}

export function useAlternateFeed(feed: Feed & { alternate?: Partial<Feed> }): Thunk {
  return (dispatch, _getState) => {
    dispatch({
      type: UPDATE_FEED,
      payload: {
        feed,
        attributes: {
          ...feed.alternate,
          error: undefined,
          alternate: undefined,
        }
      },
      meta: {
        checkpoint: "Updated feed"
      }
    })

    // Fetch from the new feed to show updates to the user
    dispatch(fetchFeed({ ...feed, ...feed.alternate }))
  }
}

export function removeFeed(feed: Feed) {
  return {
    type: REMOVE_FEED,
    payload: { feed },
    meta: {
      checkpoint: "Deleted feed"
    }
  } as const
}

export function renameFeed(feed: Feed, title: string) {
  return {
    type: RENAME_FEED,
    payload: { feed, title }
  } as const
}

export function fetchFeed(feed: Feed) {
  return {
    type: FETCH_FEED,
    payload: { feed }
  } as const
}

export function fetchAll() {
  return {
    type: FETCH_ALL,
    payload: {}
  } as const
}

export function editFeed(feed: Feed) {
  return {
    type: EDIT_FEED,
    payload: { feed }
  } as const
}

export function updateFeed(feed: Feed, attributes: Partial<Feed>) {
  return {
    type: UPDATE_FEED,
    payload: { feed, attributes }
  } as const
}

// Action types derived from action creators
type RemoveFeedAction = ReturnType<typeof removeFeed> 
type RenameFeedAction = ReturnType<typeof renameFeed>
type FetchFeedAction = ReturnType<typeof fetchFeed> & { ready?: boolean }
type FetchAllAction = ReturnType<typeof fetchAll>
type EditFeedAction = ReturnType<typeof editFeed>
type UpdateFeedAction = ReturnType<typeof updateFeed>

// Special actions not derived from simple action creators
type AddFeedAction = {
  type: typeof ADD_FEED
  payload: { feed: Feed; parentId?: string }
}

type FeedAction =
  | AddFeedAction
  | RemoveFeedAction
  | RenameFeedAction
  | FetchFeedAction
  | FetchAllAction
  | EditFeedAction
  | UpdateFeedAction

const initialState: FeedsState = {}

const reducer = (state = initialState, action: FeedAction): FeedsState => {
  if (action.type === FETCH_ALL) return state

  const feed = action.payload?.feed

  switch (action.type) {
    case ADD_FEED:
      return Object.assign({}, state, { [feed.id]: feed })

    case REMOVE_FEED:
      return reduceRemoveFeed(state, feed)

    case RENAME_FEED:
      return reduceFeedRenamed(state, feed, action.payload.title)

    case EDIT_FEED:
      return reduceEditFeed(state, feed)

    case UPDATE_FEED:
      return reduceFeedUpdate(state, feed, action.payload.attributes)

    case FETCH_FEED:
      return reduceFeedUpdate(state, feed, { isLoading: !action.ready })

    default:
      return state
  }
}

function reduceRemoveFeed(state: FeedsState, feed: Feed): FeedsState {
  const nextState = Object.assign({}, state)
  delete nextState[feed.id]
  return nextState
}

function reduceEditFeed(state: FeedsState, feed: Feed): FeedsState {
  const newFeed = { ...feed, isEditing: true }

  return { ...state, [feed.id]: newFeed }
}

function reduceFeedUpdate(state: FeedsState, feed: Feed, attributes: Partial<Feed>): FeedsState {
  const currentFeed = state[feed.id]
  if (!currentFeed) return state

  if ((attributes).error) {
    const newFeed = { ...currentFeed, ...attributes, isLoading: false }
    return Object.assign({}, state, { [feed.id]: newFeed })
  } else {
    const newFeed = { ...currentFeed, ...attributes }
    return Object.assign({}, state, { [feed.id]: newFeed })
  }
}

function reduceFeedRenamed(state: FeedsState, feed: Feed, title: string): FeedsState {
  const customTitle = title
  const newFeed = { ...feed, customTitle, isEditing: false }

  return { ...state, [feed.id]: newFeed }
}

const selectors = {
  allFeeds: (state: RootState): Feed[] => {
    return Object.values(state[name])
  },
  allFeedsByUrl: (state: RootState): Record<string, Feed> => {
    const feedsByUrl: Record<string, Feed> = {}
    const allFeeds = selectors.allFeeds(state)

    allFeeds.forEach((feed) => {
      feedsByUrl[feed.url] = feed
    })

    return feedsByUrl
  },
  getFeedById: (state: RootState, id: string): Feed | undefined => {
    return state[name][id]
  },
  getFeedTitle: (feed: Feed): string => {
    return feed.customTitle || feed.title
  }
}

export default {
  name,
  reducer,
  selectors,
  serialize: true,
}
