import type { Action, Reducer, Store } from 'redux'
import browser from 'webextension-polyfill'
import { reportError } from "../util/errorHandler"
import throttle from "lodash/throttle"
import pick from "lodash/pick"
import type { RootState } from './types'

const STATE_KEY = "brook" as const

const UPDATE_PERSISTENT_STATE = "UPDATE_PERSISTENT_STATE" as const

function updatePersistedState(data: Partial<RootState>) {
  return {
    type: UPDATE_PERSISTENT_STATE,
    payload: data,
  } as const
}

type UpdatePersistedStateAction = ReturnType<typeof updatePersistedState>

export function persistedReducer<S extends RootState, A extends Action>(reducer: Reducer<S, A>) {
  return (state: S | undefined, action: A | UpdatePersistedStateAction): S => {
    if (action.type === UPDATE_PERSISTENT_STATE) {
      const updateAction = action as UpdatePersistedStateAction
      state = { ...state, ...updateAction.payload } as S
    }

    return reducer(state, action as A)
  }
}

export function connectStoreToStorage(store: Store<RootState>, serializePaths: (keyof RootState)[]): Promise<void> {
  return loadState()
    .then(state => {
      if (state) {
        store.dispatch(updatePersistedState(state))
      }
    })
    .then(() => {
      store.subscribe(throttle(() => {
        const state = store.getState()
        const savedState = pick(state, serializePaths)

        saveState(savedState).catch(error => {
          reportError(error)
        })
      }, 1000))
    })
    .catch(error => {
      reportError(error)
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
  return jsonState ? JSON.parse(jsonState) as Partial<RootState> : {}
}

function loadStateFromExtensionStorage(): Promise<Partial<RootState>> {
  if (!browser.storage?.local) return Promise.resolve({})

  return browser.storage.local.get(STATE_KEY)
    .then(payload => payload[STATE_KEY] as Partial<RootState>)
}

function saveStateToExtensionStorage(state: Partial<RootState>): Promise<void> {
  if (!browser.storage?.local) return Promise.resolve(undefined)

  return browser.storage.local.set({
    [STATE_KEY]: state
  })
}
