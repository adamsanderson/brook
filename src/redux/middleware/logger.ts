/* eslint-disable no-console */

import type { Middleware, UnknownAction } from "redux"

/**
 * Logs all actions and states after they are dispatched.
 * 
 * http://redux.js.org/docs/advanced/Middleware.html
 */
const logger: Middleware = store => next => (action: unknown) => {
  console.groupCollapsed((action as UnknownAction).type)
  console.info('dispatching', action)
  const result = next(action)
  console.log('next state', store.getState())
  console.groupEnd()
  return result
}

export default logger