import feeds, { REMOVE_FEED, FEED, FETCH_FEED } from './feeds'
import folders, { REMOVE_FOLDER, FOLDER } from './folders'
import views from './views'

export const SELECT_FEED = "SELECT_FEED"
export const SELECT_FOLDER = "SELECT_FOLDER"
export const SELECT_ITEM = "SELECT_ITEM"
export const CHANGE_VIEW = "CHANGE_VIEW"

export const DEFAULT_VIEW = "all"

export const VIEWS = {
  all: {
    name: "Feeds",
    filter: undefined,
  },
  recent: {
    name: "Recent",
    filter: views.selectors.isFeedRecent
  },
}

const name = "ui"

export function selectFeed(feed) {
  return (dispatch, _getState) => {
    dispatch({type: FETCH_FEED, payload: { feed }})
    dispatch({type: SELECT_FEED, payload: { feed }})
  }
}

export function selectFolder(folder) {
  return {
    type: SELECT_FOLDER,
    payload: { folder }
  }
}

export function selectItem(item) {
  return {
    type: SELECT_ITEM,
    payload: { item }
  }
}

export function changeView(view) {
  return {
    type: CHANGE_VIEW,
    payload: { view }
  }
}

const initialState = {
  selectedId: undefined,
  selectedType: undefined,
  currentView: DEFAULT_VIEW,
}

const reducer = (state = initialState, action) => {  
  switch (action.type) {
    case SELECT_FEED:
      return { ...state, selectedId: action.payload.feed.id, selectedType: FEED }
    case SELECT_FOLDER:
      return { ...state, selectedId: action.payload.folder.id, selectedType: FOLDER }
    case REMOVE_FEED: 
      return reduceRemoveItem(state, action.payload.feed)
    case REMOVE_FOLDER: 
      return reduceRemoveItem(state, action.payload.folder)
    case CHANGE_VIEW:
    return { ...state, currentView: action.payload.view }
    default:
      return state
  }
}

function reduceRemoveItem(state, item) {
  if (item.type !== state.selectedType) return state
  if (item.id !== state.selectedId) return state

  return { ...state, selectedId: undefined, selectedType: undefined }
}

const selectors = {
  currentFeed: (state) => {
    if (state[name].selectedType !== FEED) return undefined
    const id = state[name].selectedId
    return state[feeds.name][id]
  },

  currentFolder: (state) => {
    if (state[name].selectedType !== FOLDER) return undefined
    const id = state[name].selectedId
    return state[folders.name][id]
  },

  currentItems: (state) => {
    const feed = selectors.currentFeed(state)
    return (feed && feed.items) || []
  },

  currentNodeList: (state) => {
    const view = state[name].currentView || DEFAULT_VIEW
    const filter = VIEWS[view].filter
    return selectors.getNodeList(state, filter)
  },

  currentViewName: (state) => {
    const view = state[name].currentView || DEFAULT_VIEW
    const title = VIEWS[view].name
    return title
  },

  getNodeList: (state, filter, node, depth) => {
    if (!node) {
      node = folders.selectors.getRootNode(state)
      return selectors.getNodeList(state, filter, node, -1).slice(1)
    }
    
    if (node.type === FEED) {
      const include = !filter || filter(state, node)
      return include ? [createTreeNode(node)] : []
    } else if (node.type === FOLDER && !filter && !node.expanded) {
      // Shortcut, skip evaluating children for collapsed nodes if
      // we don't need to see if they have any active children
      return [createTreeNode(node)]
    } else {
      let children = folders.selectors
        .getChildren(state, node)
        .flatMap(c => selectors.getNodeList(state, filter, c, depth + 1))

      if (!filter || children.length > 0) {
        if (node.expanded) {
          children.unshift(createTreeNode(node))
          return children
        } else {
          return [createTreeNode(node)]
        }
      } else {
        return []
      }
    }

    function createTreeNode(node) {
      return {
        depth,
        id: node.id,
        item: node,
        expanded: node.expanded,
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