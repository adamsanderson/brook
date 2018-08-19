export const DELAYED_ACTION = "timeoutScheduler/DELAYED"

/**
 * Schedules actions with { meta: { delay: N } } to be delayed by N milliseconds.
 * Makes `dispatch` return a function to cancel the timeout in this case.
 * 
 * Based on:
 * https://redux.js.org/docs/advanced/Middleware.html
 */
const timeoutScheduler = store => next => action => {
  if (!action.meta || !action.meta.delay) {
    return next(action)
  }

  let timeoutId = setTimeout(
    () => next(action),
    action.meta.delay
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