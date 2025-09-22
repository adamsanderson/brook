import omit from 'lodash/omit'
import get from 'lodash/get'
import has from 'lodash/has'
import { Action, Reducer, UnknownAction } from 'redux'
import type { RootState } from './types'

export const ROLLBACK = "CHECKPOINT:ROLLBACK" as const
export const START_BATCH = "CHECKPOINT:START_BATCH" as const
export const END_BATCH = "CHECKPOINT:END_BATCH" as const

const KEY = "_checkpoint" as const

type CheckpointState = {
  checkpoint: Partial<RootState>
  name: string
  transaction?: boolean
}

type StateWithCheckpoint = RootState & {
  [KEY]?: CheckpointState
}

type CheckpointOptions = {
  exclude: string[]
}

export function rollback() {
  return {
    type: ROLLBACK
  } as const
}

export function startBatch(name: string) {
  return {
    type: START_BATCH,
    meta: {
      checkpoint: name
    }
  } as const
}

export function endBatch() {
  return {
    type: END_BATCH
  } as const
}

// Action types derived from action creators
type RollbackAction = ReturnType<typeof rollback>
type StartBatchAction = ReturnType<typeof startBatch>
type EndBatchAction = ReturnType<typeof endBatch>

export type CheckpointAction =
  | RollbackAction
  | StartBatchAction
  | EndBatchAction

type CheckPointableAction = Action & {meta: {checkpoint: string}}

export function checkpointableReducer(
  reducer: Reducer<RootState, UnknownAction>,
  options: Partial<CheckpointOptions> = {}
): Reducer<StateWithCheckpoint, UnknownAction> {
  const finalOptions: CheckpointOptions = {
    exclude: [],
    ...options
  }
  finalOptions.exclude.push(KEY)

  return (state: StateWithCheckpoint = {} as StateWithCheckpoint, action: UnknownAction): StateWithCheckpoint => {
    if (action.type === ROLLBACK && state[KEY]) {
      return Object.assign({}, omit(state, [KEY]), state[KEY].checkpoint) as StateWithCheckpoint

    } else if (action.type === START_BATCH) {
      const checkpoint = omit(state, finalOptions.exclude) as Partial<RootState>
      return nextState(state, action, {checkpoint, name: (action as StartBatchAction).meta.checkpoint, transaction: true})

    } else if (action.type === END_BATCH) {
      const checkpointData = state[KEY]
      if (!checkpointData) return state
      const checkpoint = {...checkpointData, transaction: false}
      return nextState(state, action, checkpoint)

    } else if (has(action, ["meta", "checkpoint"]) && !get(state, [KEY, 'transaction'])) {
      const checkpoint = omit(state, finalOptions.exclude) as Partial<RootState>
      return nextState(state, action, {checkpoint, name: (action as CheckPointableAction).meta.checkpoint})

    } else {
      const checkpointState = state[KEY]
      return nextState(state, action, checkpointState)
    }
  }

  function nextState(state: StateWithCheckpoint, action: UnknownAction, checkpointState?: CheckpointState): StateWithCheckpoint {
    const stateWithoutCheckpoint = omit(state, [KEY]) as RootState
    const reduced = reducer(stateWithoutCheckpoint, action)
    return {...reduced, [KEY]: checkpointState} as StateWithCheckpoint
  }
}

export const selectors = {
  hasCheckpoint: (state: StateWithCheckpoint): boolean => {
    return !!state[KEY]
  },
  getCheckpointName: (state: StateWithCheckpoint): string | undefined => {
    return state[KEY] && state[KEY].name
  }
}