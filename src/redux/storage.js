import { reportError } from "../util/errorHandler"
import throttle from "lodash/throttle"
import pick from "lodash/pick"

const STATE_KEY = "brook"

const UPDATE_PERSISTANT_STATE = "UPDATE_PERSISTANT_STATE"

function updatePersistedState(data) {
  return {
    type: UPDATE_PERSISTANT_STATE,
    payload: data,
  }
}

export function persistedReducer(reducer) {
  return (state, action) => {  
    if (action.type === UPDATE_PERSISTANT_STATE) {
      state = {...state, ...action.payload}
    }
    
    return reducer(state, action)
  }
}

export function connectStoretoStorage(store, serializePaths) {
  // Set up store persistence
  loadState()
    .then(state => {
      store.dispatch(updatePersistedState(state))
    })
    .catch(error => {
      reportError(error)
    })
    .then(() => {
      store.subscribe(throttle(() => {
        const state = store.getState()
        const savedState = pick(state, serializePaths)
        
        saveState(savedState)
      }, 1000))
    })
}

// Load state from the browser's plugin storage with a fallback to
// localStorage for any plugins in a transitional state.
// 
// Returns a promise.
function loadState() {
  return loadStateFromExtensionStorage()
    .then(value => {
      return value || loadStateFromLocalStorage()
    })
    .catch(error => {
      console.error("Could not load state", error)
      return undefined
    })
}

// Saves state to the browser's plugin storage.
// Currently we don't try to save state to localstorage
// since it's not reliable across restarts.
function saveState(state) {
  return saveStateToExtensionStorage(state)
    .catch(error => console.error("Could not save state", error))
}

function loadStateFromLocalStorage() {
  const jsonState = localStorage.getItem(STATE_KEY)
  return jsonState ? JSON.parse(jsonState) : undefined
}

function loadStateFromExtensionStorage() {
  if (!browser || !browser.storage || !browser.storage.local) return Promise.resolve(undefined)

  return browser.storage.local.get(STATE_KEY)
    .then(payload => payload[STATE_KEY])
}

function saveStateToExtensionStorage(state) {
  if (!browser || !browser.storage || !browser.storage.local) return
  
  return browser.storage.local.set({
    [STATE_KEY]: state
  })
}