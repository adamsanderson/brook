import { buildFolder } from "../factories"
import feeds, { ADD_FEED, REMOVE_FEED, FEED, removeFeed } from './feeds'
import {BEFORE, OVER} from '../../constants'
import { SELECT_FOLDER } from './ui'
import { startBatch, endBatch } from "../checkpoint"

export const TOGGLE_FOLDER = "TOGGLE_FOLDER"
export const ADD_FOLDER = "ADD_FOLDER"
export const REMOVE_FOLDER = "REMOVE_FOLDER"
export const REMOVE_BRANCH = "REMOVE_BRANCH"
export const MOVE_FOLDER = "MOVE_FOLDER"
export const MOVE_FEED = "MOVE_FEED"
export const EDIT_FOLDER = "EDIT_FOLDER"
export const RENAME_FOLDER = "RENAME_FOLDER"

const name = "folders"

export const ROOT = "ROOT"
export const FOLDER = "FOLDER"

export function addFolder(folder, { parentId } = {}) {
  return {
    type: ADD_FOLDER, 
    payload: { folder: buildFolder(folder), parentId }
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
  return (dispatch, getState) => {
    dispatch(startBatch("Deleted folder"))
    const state = getState()
    removeRecursively(folder)
    dispatch(endBatch())

    function removeRecursively(node) {
      if (node.type === FEED) {
        dispatch(removeFeed(node))
      } else if (node.type === FOLDER) {
        dispatch(removeFolder(node))
        selectors.getChildren(state, node).forEach(n => removeRecursively(n))
      }
    }
  }
}

export function editFolder(folder) {
  return {
    type: EDIT_FOLDER, 
    payload: { folder }
  }
}

export function renameFolder(folder, title) {
  return {
    type: RENAME_FOLDER, 
    payload: { folder, title }
  }
}

const initialState = { 
  [ROOT]: {
    id: ROOT, 
    title: "Brook", 
    type: FOLDER,
    expanded: true,
    children: []
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

    case EDIT_FOLDER:
      return folderEdited(state, action)
    
    case RENAME_FOLDER:
      return folderRenamed(state, action)

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

  return nodeAdded(state, feed, parentId)
}

function folderAdded(state, action) {
  const folder = action.payload.folder
  const parentId = action.payload.parentId

  state = {...state, [folder.id]: folder}
  return nodeAdded(state, folder, parentId)
}

function folderToggled(state, action) {
  const folder = action.payload.folder
  const newFolder = {...folder, expanded: !folder.expanded}
  
  return {...state, [folder.id]: newFolder}
}

function folderEdited(state, action) {
  const folder = action.payload.folder
  const newFolder = {...folder, isEditing: true}
  
  return {...state, [folder.id]: newFolder}
}

function folderRenamed(state, action) {
  const folder = action.payload.folder
  const title = action.payload.title
  const newFolder = {...folder, title, isEditing: false}
  
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
  } else { // Otherwise it's AFTER
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

  return nodeRemoved(state, folder)
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

  // If there is a parent, update it.  A parent may not exist if we are removing a branch
  // or if this is a root node.
  if (parent) {
    parent = {...parent, children: parent.children.filter((c) => c !== child)}
    return {...state, [parent.id]: parent}
  } else {
    return state
  }
  
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
}

export default {
  name,
  reducer,
  selectors,
  serialize: true,
}