import type { Middleware, UnknownAction } from "redux"

export const DELAYED_ACTION = "timeoutScheduler/DELAYED"


/**
 * Schedules actions with { meta: { delay: N } } to be delayed by N milliseconds.
 * Makes `dispatch` return a function to cancel the timeout in this case.
 * 
 * Based on:
 * https://redux.js.org/docs/advanced/Middleware.html
 */
const timeoutScheduler: Middleware = _store => next => (action: unknown): unknown => {
  const unknownAction = action as UnknownAction & { meta?: { delay?: number } }

  if (!unknownAction.meta?.delay) {
    return next(action)
  }

  const timeoutId = setTimeout(
    () => next(action),
    unknownAction.meta.delay
  )

  next({
    type: DELAYED_ACTION,
    payload: {
      action
    },
    meta: {
      timeoutId
    }
  })

  return function cancel() {
    clearTimeout(timeoutId)
  }
}

export default timeoutScheduler