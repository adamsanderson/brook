import feeds, { ADD_FEED, REMOVE_FEED, FEED } from './feeds'

export const TOGGLE_FOLDER = "TOGGLE_FOLDER"

const name = __filename

const ROOT = "root"
export const FOLDER = "FOLDER"

export function toggleFolder(folder) {
  return {
    type: TOGGLE_FOLDER, 
    payload: { folder }
  }
}

const initialState = { 
  [ROOT]: {
    id: ROOT, 
    name: "Brook", 
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
    name: "Stats/Data", 
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

    case TOGGLE_FOLDER:
      return folderToggled(state, action)

    default:
      return state
  }
}

function feedAdded(state, action) {
  const feed = action.payload.feed
  let parent = state[action.payload.parentId] || state[ROOT]
  parent = {...parent, children: [...parent.children, {type: feed.type, id: feed.id}]}

  return {...state, [parent.id]: parent}
}

function feedRemoved(state, action) {
  const feedId = action.payload.feed.id
  const nodes = Object.values(state)
  const parentIndex = nodes.findIndex((node) => {
    return node.children.findIndex((c) => c.type === FEED && c.id === feedId ) >= 0
  })
  let parent = nodes[parentIndex]
  parent = {...parent, children: parent.children.filter(id => id != feedId)}
  
  return {...state, [parent.id]: parent}
}

function folderToggled(state, action) {
  const folder = action.payload.folder
  const newFolder = {...folder, expanded: !folder.expanded}
  
  return {...state, [folder.id]: newFolder}
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
}

export default {
  name,
  reducer,
  selectors
}