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
    if (action.type === ROLLBACK && state[KEY]) {
      return Object.assign({}, omit(state, [KEY]), state[KEY].checkpoint)
    } else if (action.meta && action.meta.checkpoint) {
      const checkpoint = omit(state, options.exclude)
      const nextState = reducer(state, action)
      return {...nextState, [KEY]: {checkpoint, name: action.meta.checkpoint}}
    } else {
      const checkpoint = state[KEY]
      const nextState = reducer(state, action)
      return {...nextState, [KEY]: checkpoint}
    }
  }
}

export const selectors = {
  hasCheckpoint: (state) => {
    return !!state[KEY]
  },
  getCheckpointName: (state) => {
    return state[KEY] && state[KEY].name
  }
}