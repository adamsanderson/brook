import feeds, { REMOVE_FEED, FEED } from './feeds'
import folders, { REMOVE_FOLDER, FOLDER } from './folders'

export const SELECT_FEED = "SELECT_FEED"
export const UI_SELECT_FEED = "UI_SELECT_FEED"

export const SELECT_FOLDER = "SELECT_FOLDER"

export const SELECT_ITEM = "SELECT_ITEM"

const name = "ui"

export function selectFeed(feed) {
  return {
    type: UI_SELECT_FEED,
    payload: { feed }
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

const initialState = {
  selectedId: undefined,
  selectedType: undefined,
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
  }
}

export default {
  name,
  reducer,
  selectors,
  serialize: true,
}