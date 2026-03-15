import { createStore, applyMiddleware, type Reducer, type UnknownAction } from 'redux'
import { rootReducer, sharedMiddleware } from "../src/redux/store.ts"
import { RootState } from '../src/redux/types.ts'

export type TestState = Partial<RootState>

/**
 * Applies a redux reducer to a series of actions, returning the final state.
 * Use this if the reducer under test has no reliance on middleware.
 * 
 * @param {Function} reducer 
 * @param {Object[]} actions 
 * @param {Object=} initialState 
 * 
 * @returns {Object}
 */
export function reduceEach<S extends TestState>(reducer: Reducer<S, UnknownAction>, actions: UnknownAction[], initialState: S) {
  let state = initialState
  actions.forEach(a => state = reducer(state, a))

  return state
}

/**
 * Creates a full redux store with reducers and middleware, but without
 * any listeners for serialization, etc.
 * 
 * @param {Object} initialState for the test store
 */
export function createTestStore<S extends TestState>(initialState: S) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(...sharedMiddleware)
  )
}

/**
 * Applies redux actions to a temporary test store.
 * Use this if the reducer under test relies on middleware such as redux-thunk.
 * 
 * @param {Object[]} actions 
 * @param {Object=} initialState 
 * 
 * @returns {Object}
 */
export function dispatchEach<S extends TestState>(actions: UnknownAction | UnknownAction[], initialState: S): S {
  const store = createTestStore(initialState)
  if (Array.isArray(actions)) {
    actions.forEach(a => store.dispatch(a))
  } else {
    store.dispatch(actions)
  }

  return store.getState() as S
}