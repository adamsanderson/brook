import omit from 'lodash/omit'

export const ROLLBACK = "CHECKPOINT:ROLLBACK"

const KEY = "_checkpoint"

export function rollback() {
  return {
    type: ROLLBACK
  }
}

export function checkpointableReducer(reducer, options={}) {
  options = {
    exclude: [],
    ...options
  }
  options.exclude.push(KEY)

  return (state, action) => {
    if (action.type === ROLLBACK) {
      return Object.assign({}, omit(state, [KEY]), state[KEY])
    } else if (action.meta && action.meta.checkpoint) {
      const checkpoint = omit(state, options.exclude)
      const nextState = reducer(state, action)
      return {...nextState, [KEY]: checkpoint}
    }
    
    const checkpoint = state[KEY]
    return {...reducer(state, action), [KEY]: checkpoint}
  }
}

export const selectors = {
  hasCheckpoint: (state) => {
    return !!state[KEY]
  }
}