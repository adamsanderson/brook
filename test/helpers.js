
/**
 * Applies a redux reducer to a series of actions, returning the final state.
 * 
 * @param {Function} reducer 
 * @param {Object[]} actions 
 * @param {Object=} initialState 
 * 
 * @returns {Object}
 */
export function reduceEach(reducer, actions, initialState = undefined) {
  let state = initialState
  actions.forEach(a => state = reducer(state, a))

  return state
}