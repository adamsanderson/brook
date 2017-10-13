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
const readyStatePromise = store => next => action => {
  if (!action.promise) {
    return next(action)
  }
  
  function makeAction(ready, data) {
    let newAction = Object.assign({}, action, data, { ready })
    delete newAction.promise
    return newAction
  }

  next(makeAction(false))
  return action.promise.then(
    payload => next(makeAction(true, { payload })),
    error => next(makeAction(true, { error }))
  )
}

export default readyStatePromise