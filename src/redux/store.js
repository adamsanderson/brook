import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { alias } from 'react-chrome-redux'
import thunk from 'redux-thunk'
import throttle from 'lodash/throttle'
import pick from 'lodash/pick'

import feeds from './modules/feeds'
import folders from './modules/folders'
import ui from './modules/ui'
import views from './modules/views'
import discovery from './modules/discovery'
import activeTab from './modules/activeTab'
import modal from './modules/modal'

import backgroundActions from './middleware/backgroundActions'
import { loadState, saveState } from './storage'
import logger from './middleware/logger'
import promise from './middleware/promise'

const initialState = {}
const reducers = {}
const middleware = [backgroundActions, thunk, promise]
const enhancers = []
const serializePaths = []

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

// Add the logger last so that it can report on everything:
middleware.push(logger)

// Create store
const rootReducer = combineReducers(reducers)
const enhancedMiddleware = compose(
  applyMiddleware(...middleware),
  ...enhancers
)
const store = createStore(
  rootReducer,
  loadState() || initialState,
  enhancedMiddleware
)

store.subscribe(throttle(() => {
  const state = store.getState()
  const savedState = pick(state, serializePaths)
  
  saveState(savedState)
}, 1000))

export default store