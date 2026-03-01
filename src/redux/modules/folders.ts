import { buildFolder } from "../factories"
import {Folder, FolderInput, Feed} from "../types"
import feeds, { ADD_FEED, REMOVE_FEED, FEED, removeFeed } from './feeds'
import { BEFORE, OVER, AFTER, type PositionType } from '../../constants'
import { SELECT_FOLDER } from './ui'
import { startBatch, endBatch } from "../checkpoint"
import type { NodeRef, RootState, Thunk } from "../types"

export const TOGGLE_FOLDER = "TOGGLE_FOLDER" as const
export const ADD_FOLDER = "ADD_FOLDER" as const
export const REMOVE_FOLDER = "REMOVE_FOLDER" as const
export const REMOVE_BRANCH = "REMOVE_BRANCH" as const
export const MOVE_FOLDER = "MOVE_FOLDER" as const
export const MOVE_FEED = "MOVE_FEED" as const
export const EDIT_FOLDER = "EDIT_FOLDER" as const
export const RENAME_FOLDER = "RENAME_FOLDER" as const

const name = "folders" as const

export const ROOT = "ROOT" as const
export const FOLDER = "FOLDER" as const

type FoldersState = Record<string, Folder>

export type { FoldersState }

export function addFolder(folder: FolderInput, { parentId }: { parentId?: string } = {}) {
  return {
    type: ADD_FOLDER,
    payload: { folder: buildFolder(folder), parentId }
  } as const
}

export function moveNode(source: NodeRef, target: NodeRef, position: PositionType) {
  const type = source.type === FEED ? MOVE_FEED : MOVE_FOLDER

  return {
    type,
    payload: { source, target, position }
  } as const
}

export function removeFolder(folder: Folder) {
  return {
    type: REMOVE_FOLDER,
    payload: { folder }
  } as const
}

export function removeBranch(folder: Folder): Thunk {
  return (dispatch, getState) => {
    dispatch(startBatch("Deleted folder"))
    const state = getState()
    removeRecursively(folder)
    dispatch(endBatch())

    function removeRecursively(node: Folder | Feed) {
      if (node.type === FEED) {
        dispatch(removeFeed(node as Feed))
      } else if (node.type === FOLDER) {
        dispatch(removeFolder(node as Folder))
        selectors.getChildren(state, node as Folder).forEach(n => removeRecursively(n))
      }
    }
  }
}

export function editFolder(folder: Folder) {
  return {
    type: EDIT_FOLDER,
    payload: { folder }
  } as const
}

export function renameFolder(folder: Folder, title: string) {
  return {
    type: RENAME_FOLDER,
    payload: { folder, title }
  } as const
}

// Action types derived from action creators
type AddFolderAction = ReturnType<typeof addFolder>
type MoveFeedAction = ReturnType<typeof moveNode> & { type: typeof MOVE_FEED }
type MoveFolderAction = ReturnType<typeof moveNode> & { type: typeof MOVE_FOLDER }
type RemoveFolderAction = ReturnType<typeof removeFolder>
type EditFolderAction = ReturnType<typeof editFolder>
type RenameFolderAction = ReturnType<typeof renameFolder>

// External actions this module responds to
type SelectFolderAction = { type: typeof SELECT_FOLDER; payload: { folder: Folder } }
type AddFeedAction = { type: typeof ADD_FEED; payload: { feed: Feed; parentId?: string } }
type RemoveFeedAction = { type: typeof REMOVE_FEED; payload: { feed: Feed } }

type FolderAction =
  | AddFolderAction
  | MoveFeedAction
  | MoveFolderAction
  | RemoveFolderAction
  | EditFolderAction
  | RenameFolderAction
  | SelectFolderAction
  | AddFeedAction
  | RemoveFeedAction

const initialState: FoldersState = {
  [ROOT]: {
    id: ROOT,
    title: "Brook",
    type: FOLDER,
    expanded: true,
    isEditing: false,
    children: []
  },
}

const reducer = (state = initialState, action: FolderAction): FoldersState => {
  switch (action.type) {
    case ADD_FEED:
      return feedAdded(state, action as AddFeedAction)

    case REMOVE_FEED:
      return feedRemoved(state, action as RemoveFeedAction)

    case ADD_FOLDER:
      return folderAdded(state, action as AddFolderAction)

    case REMOVE_FOLDER:
      return folderRemoved(state, action as RemoveFolderAction)

    case EDIT_FOLDER:
      return folderEdited(state, action as EditFolderAction)

    case RENAME_FOLDER:
      return folderRenamed(state, action as RenameFolderAction)

    case MOVE_FEED:
      return feedMoved(state, action as MoveFeedAction)

    case MOVE_FOLDER:
      return folderMoved(state, action as MoveFolderAction)

    case SELECT_FOLDER:
      return folderToggled(state, action as SelectFolderAction)

    default:
      return state
  }
}

function feedAdded(state: FoldersState, action: AddFeedAction): FoldersState {
  const feed = action.payload.feed
  const parentId = action.payload.parentId

  return nodeAdded(state, { type: FEED, id: feed.id }, parentId)
}

function folderAdded(state: FoldersState, action: AddFolderAction): FoldersState {
  const folder = action.payload.folder
  const parentId = action.payload.parentId

  // Convert Folder to Folder by changing children type
  const Folder: Folder = {
    ...folder,
    children: [] // buildFolder creates string[], we need NodeRef[]
  }

  state = {...state, [folder.id]: Folder}
  return nodeAdded(state, { type: FOLDER, id: folder.id }, parentId)
}

function folderToggled(state: FoldersState, action: SelectFolderAction): FoldersState {
  const folder = action.payload.folder
  const newFolder = {...folder, expanded: !folder.expanded}

  return {...state, [folder.id]: newFolder}
}

function folderEdited(state: FoldersState, action: EditFolderAction): FoldersState {
  const folder = action.payload.folder
  const newFolder = {...folder, isEditing: true}

  return {...state, [folder.id]: newFolder}
}

function folderRenamed(state: FoldersState, action: RenameFolderAction): FoldersState {
  const folder = action.payload.folder
  const title = action.payload.title
  const newFolder = {...folder, title, isEditing: false}

  return {...state, [folder.id]: newFolder}
}

function nodeAdded(state: FoldersState, node: NodeRef, parentId?: string): FoldersState {
  let parent = state[parentId || ROOT] || state[ROOT]
  parent = {...parent, children: [...parent.children, node]}

  return {...state, [parent.id]: parent}
}

function nodeSiblingAdded(state: FoldersState, source: NodeRef, target: NodeRef, position: PositionType): FoldersState {
  const targetId = target.id
  const targetType = target.type
  const targetFolder = targetType === FOLDER ? state[targetId] : undefined
  let childIndex: number = -1
  let parent: Folder | undefined

  if (targetFolder?.expanded && position === AFTER) {
    // Special case: dropping "after" an open folder is actually dropping into the first
    // position of that folder's children
    parent = state[targetId] || state[ROOT]
    position = BEFORE
    childIndex = 0
  } else {
    const nodes = Object.values(state)
    parent = nodes.find((node) => {
      childIndex = node.children.findIndex((c) => c.type === targetType && c.id === targetId)
      return childIndex >= 0
    })
  }

  if (!parent) return state

  const children = parent.children.slice()
  if (position === BEFORE) {
    children.splice(childIndex, 0, source)
  } else { // Otherwise it's AFTER
    children.splice(childIndex + 1, 0, source)
  }

  parent = {...parent, children}
  return {...state, [parent.id]: parent}
}

function feedRemoved(state: FoldersState, action: RemoveFeedAction): FoldersState {
  const feed = action.payload.feed
  return nodeRemoved(state, { type: FEED, id: feed.id })
}

function folderRemoved(state: FoldersState, action: RemoveFolderAction): FoldersState {
  const folder = action.payload.folder

  // Clone state so we can safely delete the folder out of it:
  state = Object.assign({}, state)
  delete state[folder.id]

  return nodeRemoved(state, { type: FOLDER, id: folder.id })
}

function nodeRemoved(state: FoldersState, node: NodeRef): FoldersState {
  const nodeId = node.id
  const nodeType = node.type
  const nodes = Object.values(state)
  let child: NodeRef | undefined
  let parent = nodes.find((node) => {
    child = node.children.find((c) => c.type === nodeType && c.id === nodeId)
    return child
  })

  // If there is a parent, update it.  A parent may not exist if we are removing a branch
  // or if this is a root node.
  if (parent && child) {
    parent = {...parent, children: parent.children.filter((c) => c !== child)}
    return {...state, [parent.id]: parent}
  } else {
    return state
  }
}

function feedMoved(state: FoldersState, action: MoveFeedAction): FoldersState {
  const {source, target, position} = action.payload

  return nodeMoved(state, source, target, position)
}

function folderMoved(state: FoldersState, action: MoveFolderAction): FoldersState {
  const {source, target, position} = action.payload

  return nodeMoved(state, source, target, position)
}

function nodeMoved(state: FoldersState, source: NodeRef, target: NodeRef, position: PositionType): FoldersState {
  if (target.type === FEED && position === 0) return state

  state = nodeRemoved(state, source)
  if (position === OVER) {
    state = nodeAdded(state, source, target.id)
  } else {
    state = nodeSiblingAdded(state, source, target, position)
  }

  return state
}

const selectors = {
  getRootNode: (state: RootState): Folder | undefined => {
    return selectors.getNode(state, ROOT)
  },
  getNode: (state: RootState, id: string): Folder | undefined => {
    return state[name][id]
  },
  getTopLevelNodes: (state: RootState): (Folder | Feed)[] => {
    const root = selectors.getRootNode(state)
    return root ? selectors.getChildren(state, root) : []
  },
  getChildren: (state: RootState, node: Folder): (Folder | Feed)[] => {
    return node.children.map(c => {
      return c.type === FOLDER ? state[name][c.id] : state[feeds.name][c.id]
    }).filter(Boolean) // Filter out any undefined nodes
  },
  containsNode: (state: RootState, parent: Folder | Feed, target: Folder | Feed): boolean => {
    if (parent.id === target.id && parent.type === target.type) return true
    if (parent.type !== FOLDER) return false

    const children = selectors.getChildren(state, parent as Folder)
    return children.some(child => selectors.containsNode(state, child, target))
  },
}

export default {
  name,
  reducer,
  selectors,
  serialize: true,
}
