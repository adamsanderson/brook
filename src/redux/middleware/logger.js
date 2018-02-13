/* eslint-disable no-console */

/**
 * Logs all actions and states after they are dispatched.
 * 
 * http://redux.js.org/docs/advanced/Middleware.html
 */
const logger = store => next => action => {
  console.group(action.type)
  console.info('dispatching', action)
  const result = next(action)
  console.log('next state', store.getState())
  console.groupEnd(action.type)
  return result
}

export default logger