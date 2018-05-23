import omit from 'lodash/omit'
import get from 'lodash/get'
import has from 'lodash/has'

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
      return nextState(state, action, {checkpoint, name: action.meta.checkpoint, transaction: true})

    } else if (action.type === END_BATCH) {
      const checkpoint = {...state[KEY], transaction: false}
      return nextState(state, action, checkpoint)

    } else if (has(action, ["meta", "checkpoint"]) && !get(state, [KEY, 'transaction'])) {
      const checkpoint = omit(state, options.exclude)
      return nextState(state, action, {checkpoint, name: action.meta.checkpoint})

    } else {
      const checkpointState = state[KEY]
      return nextState(state, action, checkpointState)
    }
  }

  function nextState(state, action, checkpointState) {
    const reduced = reducer(omit(state, [KEY]), action)
    return {...reduced, [KEY]: checkpointState}
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