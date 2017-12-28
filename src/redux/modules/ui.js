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
      const feed = action.payload.feed
      return feed.id === state.selectedId && state.selectedType === FEED
        ? { ...state, selectedId: undefined }
        : state
    case REMOVE_FOLDER: 
      const folder = action.payload.folder
      return folder.id === state.selectedId && state.selectedType === FOLDER
        ? { ...state, selectedId: undefined }
        : state
    default:
      return state
  }
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