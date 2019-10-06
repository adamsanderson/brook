import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { 
  wrapStore,
  Store as ProxyStore,
  applyMiddleware as applyProxyMiddleware 
} from 'webext-redux'
import deepDiff from 'webext-redux/lib/strategies/deepDiff/diff'
import patchDeepDiff from 'webext-redux/lib/strategies/deepDiff/patch'
import thunk from 'redux-thunk'
import throttle from 'lodash/throttle'
import pick from 'lodash/pick'

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
import { loadState, saveState } from './storage'
import logger from './middleware/logger'
import promise from './middleware/promise'
import timeoutScheduler from './middleware/timeoutScheduler'
import notifications from './middleware/notifications'

export const initialState = {}
export const reducers = {}
export const sharedMiddleware = [thunk, promise, timeoutScheduler]
export const middleware = [notifications, backgroundActions, ...sharedMiddleware]
export const enhancers = []
const serializePaths = []

const REDUX_PORT_NAME = "Brook"

// Register Modules:
function addModule(module) {
  if (!module.name) throw new Error("Name required")
  
  if (module.reducer)     reducers[module.name] = module.reducer
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
export const rootReducer = resetableReducer(
  checkpointableReducer(
    combineReducers(reducers),
    {exclude: [modal.name, discovery.name, activeTab.name]}
  )
)
const enhancedMiddleware = compose(
  applyMiddleware(...middleware),
  ...enhancers
)

const storePromise = loadState()
  .catch(_error => undefined)
  .then(state => {
    const store = createStore(
      rootReducer,
      state || initialState,
      enhancedMiddleware
    )
    
    // Save state at most once every 1s
    store.subscribe(throttle(() => {
      const state = store.getState()
      const savedState = pick(state, serializePaths)
      
      saveState(savedState)
    }, 1000))

    return store
  })

export function createBackgroundStore() {
  return storePromise.then(store => {
    // Connect store to fire and forget dispatch channel
    connectStoreToDispatchChannel(store)

    // Wrap store with webext-redux
    wrapStore(store, {
      portName: REDUX_PORT_NAME,
      diffStrategy: deepDiff,
    })


    return store
  })
}

export function createProxyStore() {
  const proxy = new ProxyStore({
    portName: REDUX_PORT_NAME,
    patchStrategy: patchDeepDiff,
  })

  return applyProxyMiddleware(proxy, ...sharedMiddleware)
}

export default storePromise