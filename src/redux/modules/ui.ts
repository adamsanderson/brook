import { Feed, FeedItem, Folder } from '../types'
import feeds, { REMOVE_FEED, FEED, FETCH_FEED } from './feeds'
import folders, { REMOVE_FOLDER, FOLDER, FoldersState } from './folders'
import views from './views'
import type { RootState, Thunk } from '../types'

export const SELECT_FEED = "SELECT_FEED" as const
export const SELECT_FOLDER = "SELECT_FOLDER" as const
export const CLEAR_SELECTION = "CLEAR_SELECTION" as const
export const SELECT_ITEM = "SELECT_ITEM" as const
export const CHANGE_VIEW = "CHANGE_VIEW" as const

export const DEFAULT_VIEW = "all" as const

type ViewFilterFunction = (state: RootState, feed: Feed) => boolean

type ViewConfig = {
  name: string
  longName: string
  filter?: ViewFilterFunction
}

export const VIEWS: Record<string, ViewConfig> = {
  all: {
    name: "Feeds",
    longName: "All Feeds",
    filter: undefined,
  },
  recent: {
    name: "Recent",
    longName: "Recent Feeds",
    filter: views.selectors.isFeedRecent
  },
  dead: {
    name: "Stale",
    longName: "Stale Feeds",
    filter: views.selectors.isFeedStale
  },
}

const name = "ui" as const

type UIState = {
  selectedId?: string
  selectedType?: typeof FEED | typeof FOLDER
  currentViewId: string
}

export type { UIState }

type TreeNode = {
  depth: number
  id: string
  item: Feed | FoldersState[string]
  isUnread?: boolean
  expanded?: boolean
}

export function selectFeed(feed: Feed): Thunk {
  return (dispatch, _getState) => {
    dispatch({type: FETCH_FEED, payload: { feed }})
    dispatch({type: SELECT_FEED, payload: { feed }})
  }
}

export function selectFolder(folder: FoldersState[string]) {
  return {
    type: SELECT_FOLDER,
    payload: { folder }
  } as const
}

export function clearSelection() {
  return {
    type: CLEAR_SELECTION
  } as const
}

export function selectItem(item: FeedItem) {
  return {
    type: SELECT_ITEM,
    payload: { item }
  } as const
}

export function changeView(view: string) {
  return {
    type: CHANGE_VIEW,
    payload: { view }
  } as const
}

// Action types derived from action creators
type SelectFolderAction = ReturnType<typeof selectFolder>
type ClearSelectionAction = ReturnType<typeof clearSelection>
type SelectItemAction = ReturnType<typeof selectItem>
type ChangeViewAction = ReturnType<typeof changeView>

// External actions and manual actions
type SelectFeedAction = { type: typeof SELECT_FEED; payload: { feed: Feed } }
type RemoveFeedAction = { type: typeof REMOVE_FEED; payload: { feed: Feed } }
type RemoveFolderAction = { type: typeof REMOVE_FOLDER; payload: { folder: FoldersState[string] } }

type UIAction =
  | SelectFeedAction
  | SelectFolderAction
  | ClearSelectionAction
  | SelectItemAction
  | ChangeViewAction
  | RemoveFeedAction
  | RemoveFolderAction

const initialState: UIState = {
  selectedId: undefined,
  selectedType: undefined,
  currentViewId: DEFAULT_VIEW,
}

const reducer = (state = initialState, action: UIAction): UIState => {
  switch (action.type) {
    case SELECT_FEED:
      return { ...state, selectedId: action.payload.feed.id, selectedType: FEED }
    case SELECT_FOLDER:
      return { ...state, selectedId: action.payload.folder.id, selectedType: FOLDER }
    case CLEAR_SELECTION:
      return { ...state, selectedId: undefined, selectedType: undefined }
    case REMOVE_FEED:
      return reduceRemoveItem(state, action.payload.feed)
    case REMOVE_FOLDER:
      return reduceRemoveItem(state, action.payload.folder)
    case CHANGE_VIEW:
      return { ...state, currentViewId: action.payload.view }
    default:
      return state
  }
}

function reduceRemoveItem(state: UIState, item: { type: string; id: string }): UIState {
  if (item.type !== state.selectedType) return state
  if (item.id !== state.selectedId) return state

  return { ...state, selectedId: undefined, selectedType: undefined }
}

const selectors = {
  currentFeed: (state: RootState): Feed | undefined => {
    if (state[name].selectedType !== FEED) return undefined
    const id = state[name].selectedId
    return id ? state[feeds.name][id] : undefined
  },

  currentFolder: (state: RootState): FoldersState[string] | undefined => {
    if (state[name].selectedType !== FOLDER) return undefined
    const id = state[name].selectedId
    return id ? state[folders.name][id] : undefined
  },

  currentItems: (state: RootState): unknown[] => {
    const feed = selectors.currentFeed(state)
    return (feed && feed.items) || []
  },

  currentViewId: (state: RootState): string => {
    return state[name].currentViewId || DEFAULT_VIEW
  },

  currentNodeList: (state: RootState): TreeNode[] => {
    const filter = VIEWS[selectors.currentViewId(state)].filter
    return selectors.getNodeList(state, filter)
  },

  currentViewName: (state: RootState): string => {
    const title = VIEWS[selectors.currentViewId(state)].name
    return title
  },

  getNodeList: (state: RootState, filter?: ViewFilterFunction, node?: Feed | FoldersState[string], depth: number = 0): TreeNode[] => {
    if (!node) {
      node = folders.selectors.getRootNode(state)
      if (!node) return []
      return selectors.getNodeList(state, filter, node, -1).slice(1)
    }

    if (node.type === FEED) {
      const include = !filter || filter(state, node as Feed)
      return include ? [createTreeNode(node, depth)] : []
    } else if (node.type === FOLDER && !filter && !node.expanded) {
      // Shortcut, skip evaluating children for collapsed nodes if
      // we don't need to see if they have any active children
      return [createTreeNode(node, depth)]
    } else {
      let children = folders.selectors
        .getChildren(state, node as FoldersState[string])
        .flatMap(c => selectors.getNodeList(state, filter, c, depth + 1))

      if (!filter || children.length > 0) {
        if (node.expanded) {
          children.unshift(createTreeNode(node, depth))
          return children
        } else {
          return [createTreeNode(node, depth)]
        }
      } else {
        return []
      }
    }

    function createTreeNode(node: Feed | Folder, depth: number): TreeNode {
      const isUnread = node.type === FEED ? views.selectors.isFeedUnread(state, node as Feed) : undefined
      return {
        depth,
        id: node.id,
        item: node,
        isUnread,
        expanded: node.type === 'FOLDER' ? node.expanded : false,
      }
    }
  },
}

export default {
  name,
  reducer,
  selectors,
  serialize: true,
}