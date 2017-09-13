import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { alias } from 'react-chrome-redux'
import thunk from 'redux-thunk'

import feeds from './modules/feeds'
import feedCollection from './modules/feedCollection'
import ui from './modules/ui'
import views from './modules/views'

import backgroundActions from './middleware/backgroundActions'
import logger from './middleware/logger'
import promise from './middleware/promise'

const initialState = {}
const reducers = {}
const middleware = [backgroundActions, thunk, promise]
const enhancers = []

// Register Modules:
function addModule(module) {
  if (!module.name) throw new Error("Name required")
  
  if (module.reducer)     reducers[module.name] = module.reducer
  if (module.middleware)  middleware.push(module.middleware)
  if (module.enhancer)    enhancers.push(module.enhancer)
}

// Add our local modules
addModule(feeds)
addModule(feedCollection)
addModule(ui)
addModule(views)

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
  initialState,
  enhancedMiddleware
)

export default store