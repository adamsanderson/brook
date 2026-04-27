import {
  createStore,
  applyMiddleware,
  compose,
  combineReducers,
  Store,
  Reducer,
  Middleware,
  StoreEnhancer,
  UnknownAction,
} from 'redux'
import {
  Store as ProxyStore,
  applyMiddleware as applyProxyMiddleware,
  createWrapStore
} from 'webext-redux'
import deepDiff from 'webext-redux/lib/strategies/deepDiff/diff'
import patchDeepDiff from 'webext-redux/lib/strategies/deepDiff/patch'
import { thunk } from 'redux-thunk'

import ENV from '../util/env'
import feeds from './modules/feeds'
import folders from './modules/folders'
import ui from './modules/ui'
import views from './modules/views'
import discovery from './modules/discovery'
import activeTab from './modules/activeTab'
import modal from './modules/modal'
import toast from './modules/toast'
import workers from './modules/workers'
import popup from './modules/popup'
import options from './modules/options'
import { resetableReducer } from './reset'
import { checkpointableReducer } from './checkpoint'

import {connectStore as connectStoreToDispatchChannel} from './dispatchChannel'
import backgroundActions from './middleware/backgroundActions'
import { persistedReducer, connectStoreToStorage } from './storage'
import logger from './middleware/logger'
import promise from './middleware/promise'
import timeoutScheduler from './middleware/timeoutScheduler'
import notifications from './middleware/notifications'

import type { RootState } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyAction = any;

type ReduxModule<K extends keyof RootState = keyof RootState> = {
  name: K
  reducer?: Reducer<RootState[K], AnyAction>
  middleware?: Middleware
  enhancer?: StoreEnhancer
  serialize?: boolean
}

export const initialState: Partial<RootState> = {}
export const reducers: {
  [K in keyof RootState]?: Reducer<RootState[K], AnyAction>
} = {}
export const sharedMiddleware = [thunk, promise, timeoutScheduler]
export const middleware: Middleware[] = [notifications, backgroundActions, ...sharedMiddleware]
export const enhancers: StoreEnhancer[] = []
const serializePaths: (keyof RootState)[] = []

// Register Modules:
function addModule<K extends keyof RootState>(module: ReduxModule<K>): void {
  if (!module.name) throw new Error("Name required")

  if (module.reducer) {
    reducers[module.name] = module.reducer as (typeof reducers)[K]
  }
  if (module.middleware)  middleware.push(module.middleware)
  if (module.enhancer)    enhancers.push(module.enhancer)
  if (module.serialize)   serializePaths.push(module.name)
}

// Add our local modules
addModule(feeds)
addModule(folders)
addModule(ui)
addModule(views)
addModule(discovery)
addModule(activeTab)
addModule(modal)
addModule(toast)
addModule(workers)
addModule(popup)
addModule(options)

// Add the logger last so that it can report on everything:
if (!ENV.production) {
  middleware.push(logger)
}

// Create store
const combinedReducers = combineReducers(
  reducers as {
    [K in keyof RootState]: Reducer<RootState[K], AnyAction>
  }
) as Reducer<RootState, UnknownAction>

export const rootReducer = resetableReducer(
  checkpointableReducer(
    persistedReducer(
      combinedReducers
    ),
    {exclude: [modal.name, discovery.name, activeTab.name]}
  ),
  initialState
)

const enhancedMiddleware = compose(
  applyMiddleware(...middleware),
  ...enhancers
) as StoreEnhancer

export function createBackgroundStore(): Promise<Store<RootState>> {
  const store = createStore(
    rootReducer,
    initialState as RootState,
    enhancedMiddleware
  )

  // Connect store to fire and forget dispatch channel
  connectStoreToDispatchChannel(store)

  // Register onMessage listeners synchronously before any async work
  const wrapStore = createWrapStore({channelName: 'Brook'})

  // Load storage first so the initial STATE_TYPE broadcast has correct state
  return connectStoreToStorage(store, serializePaths).then(() => {
    wrapStore(store, {
      diffStrategy: deepDiff,
    })
    return store
  })
}

export function createProxyStore(): ProxyStore {
  const proxy = new ProxyStore({
    channelName: 'Brook',
    patchStrategy: patchDeepDiff,
  })

  return applyProxyMiddleware(proxy, ...sharedMiddleware)
}
