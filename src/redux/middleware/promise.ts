import type { Middleware, UnknownAction } from 'redux'

type PromiseAction = UnknownAction & {
  promise: Promise<unknown>
}

type ReadyAction = UnknownAction & {
  ready: boolean
  payload?: unknown
  error?: unknown
}

/**
 * Lets you dispatch special actions with a { promise } field.
 *
 * This middleware will turn them into a single action at the beginning,
 * and a single success (or failure) action when the `promise` resolves.
 *
 * For convenience, `dispatch` will return the promise so the caller can wait.
 *
 * Based on:
 * http://redux.js.org/docs/advanced/Middleware.html
 *
 * With the following modifications:
 */
const readyStatePromise: Middleware = _store => next => (action: unknown): unknown => {
  const promiseAction = action as PromiseAction

  if (!promiseAction.promise) {
    return next(action)
  }

  function makeAction(ready: boolean, data?: { payload?: unknown; error?: unknown }): ReadyAction {
    const newAction = { ...promiseAction, ...data, ready } as ReadyAction
    delete (newAction as UnknownAction).promise
    return newAction
  }

  next(makeAction(false))
  return promiseAction.promise.then(
    payload => next(makeAction(true, { payload })),
    error => next(makeAction(true, { error }))
  )
}

export default readyStatePromise