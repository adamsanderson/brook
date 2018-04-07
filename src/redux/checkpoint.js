import omit from 'lodash/omit'

export const ROLLBACK = "CHECKPOINT:ROLLBACK"
export const START_BATCH = "CHECKPOINT:START_BATCH"
export const END_BATCH= "CHECKPOINT:END_BATCH"

const KEY = "_checkpoint"

export function rollback() {
  return {
    type: ROLLBACK
  }
}

export function startBatch(name) {
  return {
    type: START_BATCH,
    meta: {
      checkpoint: name
    }
  }
}

export function endBatch() {
  return {
    type: END_BATCH
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
    } else if (action.type === START_BATCH) {
      const checkpoint = omit(state, options.exclude)
      const nextState = reducer(state, action)
      return {...nextState, [KEY]: {checkpoint, name: action.meta && action.meta.checkpoint, transaction: true}}
    } else if (action.type === END_BATCH) {
      const checkpoint = {...state[KEY], transaction: false}
      const nextState = reducer(state, action)
      return {...nextState, [KEY]: checkpoint}
    } else if (action.meta && action.meta.checkpoint && !state[KEY].transaction) {
      const checkpoint = omit(state, options.exclude)
      const nextState = reducer(state, action)
      return {...nextState, [KEY]: {checkpoint, name: action.meta.checkpoint}}
    } else {
      const checkpointState = state[KEY]
      const nextState = reducer(state, action)
      return {...nextState, [KEY]: checkpointState}
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