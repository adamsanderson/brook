import feeds, { ADD_FEED, REMOVE_FEED, FEED } from './feeds'

export const TOGGLE_FOLDER = "TOGGLE_FOLDER"
export const ADD_FOLDER = "ADD_FOLDER"
export const REMOVE_FOLDER = "REMOVE_FOLDER"

const name = __filename

const ROOT = "ROOT"
export const FOLDER = "FOLDER"

export function addFolder(folder, parentId) {
  return {
    type: ADD_FOLDER, 
    payload: { folder: normalizeFolder(folder), parentId }
  }
}

export function removeFolder(folder) {
  return {
    type: REMOVE_FOLDER, 
    payload: { folder }
  }
}

export function toggleFolder(folder) {
  return {
    type: TOGGLE_FOLDER, 
    payload: { folder }
  }
}

const initialState = { 
  [ROOT]: {
    id: ROOT, 
    title: "Brook", 
    type: FOLDER,
    expanded: true,
    children: [
      {type: FEED, id: "1"},
      {type: FEED, id: "2"},
      {type: FOLDER, id: "1"},
    ]
  },
  "1": {
    id: "1", 
    title: "Stats/Data", 
    type: FOLDER,
    expanded: true,
    children: [
      {type: FEED, id: "3"}
    ],
  },
}

const reducer = (state = initialState, action) => {  
  switch (action.type) {
    case ADD_FEED:
      return feedAdded(state, action)

    case REMOVE_FEED:
      return feedRemoved(state, action)

    case ADD_FOLDER:
      return folderAdded(state, action)

    case REMOVE_FOLDER:
      return folderRemoved(state, action)

    case TOGGLE_FOLDER:
      return folderToggled(state, action)

    default:
      return state
  }
}

function feedAdded(state, action) {
  const feed = action.payload.feed
  const parentId = action.payload.parentId

  return nodeAdded(state, action.payload.feed, action.payload.parentId)
}

function folderAdded(state, action) {
  const folder = action.payload.folder
  const parentId = action.payload.parentId

  state = {...state, [folder.id]: folder}
  return nodeAdded(state, folder, action.payload.parentId)
}

function folderToggled(state, action) {
  const folder = action.payload.folder
  const newFolder = {...folder, expanded: !folder.expanded}
  
  return {...state, [folder.id]: newFolder}
}

function nodeAdded(state, node, parentId) {
  let parent = state[parentId] || state[ROOT]
  parent = {...parent, children: [...parent.children, {type: node.type, id: node.id}]}

  return {...state, [parent.id]: parent}
}

function feedRemoved(state, action) {
  const feed = action.payload.feed
  return nodeRemoved(state, feed)
}

function folderRemoved(state, action) {
  const folder = action.payload.folder

  // Clone state so we can safely delete the folder out of it:
  state = Object.assign({}, state)
  delete state[folder.id]

  // Todo: Recursively delete child feeds... how does that get cleaned up?
  //       Or should that be the resposiblity of the action creator?
  return nodeRemoved(state, folder)
}

function nodeRemoved(state, node) {
  const nodeId = node.id
  const nodeType = node.type
  const nodes = Object.values(state)
  let child;
  let parent = nodes.find((node) => {
    child = node.children.find((c) => c.type === nodeType && c.id === nodeId )
    return child
  })
  
  parent = {...parent, children: parent.children.filter((c) => c !== child)}
  return {...state, [parent.id]: parent}
}

function normalizeFolder(folder) {
  return {
    id: folder.id || Math.random().toString(36).substring(2, 15),
    type: FOLDER,
    title: folder.title || "Folder",
    children: folder.children || []
  }
}

const selectors = {
  getRootNode: (state) => {
    return selectors.getNode(state, ROOT)
  },
  getNode: (state, id) => {
    return state[name][id]
  },
  getTopLevelNodes: (state) => {
    const root = selectors.getRootNode(state)
    return selectors.getChildren(state, root)
  },
  getChildren: (state, node) => {
    return node.children.map(c => {
      return c.type === FOLDER ? state[name][c.id] : state[feeds.name][c.id]
    })
  },
  getNodeList: (state, items, list=[], depth=0) => {
    if (!items) items = selectors.getTopLevelNodes(state)
    
    items.forEach((item) => {
      const node = {
        item,
        depth,
        id: item.id,
        expanded: item.expanded,
      }

      list.push(node)
      
      if (node.expanded) {
        const children = selectors.getChildren(state, item)
        if (children) {
          selectors.getNodeList(state, children, list, depth + 1)
        }
      }
    })
    
    return list
  }
}

export default {
  name,
  reducer,
  selectors
}