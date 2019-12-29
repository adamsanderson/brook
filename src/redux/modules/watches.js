import { buildWatch } from "../factories"

export const ADD_WATCH = "ADD_WATCH"
export const REMOVE_WATCH = "REMOVE_WATCH"
export const FETCH_WATCH = "FETCH_WATCH"
export const UPDATE_WATCH = "UPDATE_WATCH"

export const WATCH = "WATCH"

const name = "watches"

export function addWatch(watch, { parentId } = {}) {
  return (dispatch, _getState) => {
    watch = buildWatch(watch)

    dispatch({
      type: ADD_WATCH,
      payload: {
        watch,
        parentId
      }
    })

    dispatch(fetchWatchedSite(watch))
  }
}

export function removeWatch(watch) {
  return {
    type: REMOVE_WATCH, 
    payload: { watch },
    meta: {
      checkpoint: "Stop watching"
    }
  }
}

export function fetchWatchedSite(watch) {
  return {
    type: FETCH_WATCH, 
    payload: { watch }
  }
}

export function updateWatch(watch, attributes) {
  return {
    type: UPDATE_WATCH, 
    payload: { watch, attributes }
  }
}

const initialState = {}

const reducer = (state = initialState, action) => {
  const watch = action.payload && action.payload.watch
  if (!watch) { return state }

  switch (action.type) {
    case ADD_WATCH:
      return Object.assign({}, state, {[watch.id]: watch})

    case REMOVE_WATCH:
      return reduceRemoveWatch(state, watch)

    case UPDATE_WATCH:
      return reduceWatchUpdate(state, watch, action.payload.attributes)
      
    case FETCH_WATCH: 
      return reduceWatchUpdate(state, watch, {isLoading: !action.ready})

    default:
      return state
  }
}

function reduceRemoveWatch(state, watch) {
  const nextState = Object.assign({}, state)
  delete nextState[watch.id]
  return nextState
}

function reduceWatchUpdate(state, watch, attributes) {
  const currentWatch = state[watch.id]
  if (!currentWatch) return state

  if (attributes.error) {
    const newWatch = {...currentWatch, ...attributes, isLoading: false}
    return Object.assign({}, state, {[watch.id]: newWatch})
  } else {
    const newWatch = {...currentWatch, ...attributes}
    return Object.assign({}, state, {[watch.id]: newWatch})
  }
}

const selectors = {
  allWatches: (state) => {
    return Object.values(state[name])
  },
  allWatchesByUrl: (state) => {
    const watchesByUrl = {}
    const allWatches = selectors.allWatches(state)
    
    allWatches.forEach((watch) => {
      watchesByUrl[watch.url] = watch
    })

    return watchesByUrl
  },
  getWatchById: (state, id) => {
    return state[name][id]
  }
}

export default {
  name,
  reducer,
  selectors,
  serialize: true,
}