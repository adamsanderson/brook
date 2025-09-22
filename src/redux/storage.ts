import { Reducer, Store, UnknownAction } from 'redux'
import browser from 'webextension-polyfill'
import { reportError } from "../util/errorHandler"
import throttle from "lodash/throttle"
import pick from "lodash/pick"
import type { RootState } from './types'

const STATE_KEY = "brook" as const

const UPDATE_PERSISTANT_STATE = "UPDATE_PERSISTANT_STATE" as const

function updatePersistedState(data: Partial<RootState>) {
  return {
    type: UPDATE_PERSISTANT_STATE,
    payload: data,
  } as const
}

type UpdatePersistedStateAction = ReturnType<typeof updatePersistedState>

export function persistedReducer<S extends RootState>(reducer: Reducer<S, UnknownAction>) {
  return (state: S | undefined, action: UnknownAction | UpdatePersistedStateAction): S => {
    if (action.type === UPDATE_PERSISTANT_STATE) {
      const updateAction = action as UpdatePersistedStateAction
      state = {...state, ...updateAction.payload} as S
    }

    return reducer(state, action)
  }
}

export function connectStoreToStorage(store: Store<RootState>, serializePaths: (keyof RootState)[]) {
  // Set up store persistence
  loadState()
    .then(state => {
      if (state) {
        store.dispatch(updatePersistedState(state))
      }
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
function loadState(): Promise<Partial<RootState> | undefined> {
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
function saveState(state: Partial<RootState>): Promise<void> {
  return saveStateToExtensionStorage(state)
    .catch(error => console.error("Could not save state", error))
}

function loadStateFromLocalStorage(): Partial<RootState> {
  const jsonState = localStorage.getItem(STATE_KEY)
  return jsonState ? JSON.parse(jsonState) : {}
}

function loadStateFromExtensionStorage(): Promise<Partial<RootState>> {
  if (!browser.storage?.local) return Promise.resolve({})

  return browser.storage.local.get(STATE_KEY)
    .then(payload => payload[STATE_KEY] as Partial<RootState>)
}

function saveStateToExtensionStorage(state: Partial<RootState>): Promise<void> {
  if (!browser.storage?.local) return Promise.resolve(undefined);

  return browser.storage.local.set({
    [STATE_KEY]: state
  })
}