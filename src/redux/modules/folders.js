import feeds, { ADD_FEED, REMOVE_FEED, FEED } from './feeds'
import {BEFORE, OVER, AFTER} from '../../constants'
import { SELECT_FOLDER } from './ui';

export const TOGGLE_FOLDER = "TOGGLE_FOLDER"
export const ADD_FOLDER = "ADD_FOLDER"
export const REMOVE_FOLDER = "REMOVE_FOLDER"
export const REMOVE_BRANCH = "REMOVE_BRANCH"
export const MOVE_FOLDER = "MOVE_FOLDER"
export const MOVE_FEED = "MOVE_FOLDER"

const name = __filename

const ROOT = "ROOT"
export const FOLDER = "FOLDER"

export function addFolder(folder, parentId) {
  return {
    type: ADD_FOLDER, 
    payload: { folder: normalizeFolder(folder), parentId }
  }
}

export function moveNode(source, target, position) {
  const type = source.type === FEED ? MOVE_FEED : MOVE_FOLDER

  return {
    type,
    payload: { source, target, position }
  }
}

export function removeFolder(folder) {
  return {
    type: REMOVE_FOLDER, 
    payload: { folder }
  }
}

export function removeBranch(folder) {
  return {
    type: REMOVE_BRANCH,
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

    case REMOVE_BRANCH:
      return branchRemoved(state, action)

    case MOVE_FEED:
      return feedMoved(state, action)
    
    case MOVE_FOLDER:
      return folderMoved(state, action)

    case SELECT_FOLDER:
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

function nodeSiblingAdded(state, source, target, position) {
  const targetId = target.id
  const targetType = target.type
  let childIndex
  let parent
  
  if (targetType === FOLDER && target.expanded && position === 1) {
    // Special case: dropping "after" an open folder is actually dropping into the first
    // position of that folder's children
    parent = state[targetId] || state[ROOT]
    position = BEFORE
    childIndex = 0
  } else {
    const nodes = Object.values(state)
    parent = nodes.find((node) => {
      childIndex = node.children.findIndex((c) => c.type === targetType && c.id === targetId )
      return childIndex >= 0
    })
  }
  
  const children = parent.children.slice()
  if (position === BEFORE) {
    children.splice(childIndex, 0, source)
  } else {
    children.splice(childIndex + 1, 0, source)
  }

  parent = {...parent, children}
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

function branchRemoved(state, action) {
  const folder = action.payload.folder
  return nodeRemovedRecursively(state, folder)
}

function nodeRemovedRecursively(state, node) {
  (node.children || []).forEach(function(c) {
    state = nodeRemovedRecursively(state, c)
  })

  state = nodeRemoved(state, node)
  delete state[node.id]
  
  return state
}

function nodeRemoved(state, node) {
  const nodeId = node.id
  const nodeType = node.type
  const nodes = Object.values(state)
  let child
  let parent = nodes.find((node) => {
    child = node.children.find((c) => c.type === nodeType && c.id === nodeId )
    return child
  })
  
  parent = {...parent, children: parent.children.filter((c) => c !== child)}
  return {...state, [parent.id]: parent}
}

function feedMoved(state, action) {
  const {source, target, position} = action.payload
  
  return nodeMoved(state, source, target, position)
}

function folderMoved(state, action) {
  const {source, target, position} = action.payload

  return nodeMoved(state, source, target, position)
}

function nodeMoved(state, source, target, position) {
  if (target.type === FEED && position === 0) return

  state = nodeRemoved(state, source)
  if (position === OVER) {
    state = nodeAdded(state, source, target.id)
  } else {
    state = nodeSiblingAdded(state, source, target, position)
  }
  
  return state  
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
  containsNode: (state, parent, target) => {
    if (parent.id === target.id && parent.type === target.type) return true
    if (parent.type !== FOLDER) return false

    const children = selectors.getChildren(state, parent)
    return children.some(child => selectors.containsNode(state, child, target))
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