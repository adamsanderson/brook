import type { RootState } from '../types'

export const START_FEED_WORKER = "START_FEED_WORKER" as const
export const FINISH_FEED_WORKER = "FINISH_FEED_WORKER" as const

const name = "workers" as const

type WorkersState = {
  feedWorkers: number
}

export type { WorkersState }

export function startedFeedWorker() {
  return {
    type: START_FEED_WORKER,
    payload: {}
  } as const
}

export function finishedFeedWorker() {
  return {
    type: FINISH_FEED_WORKER,
    payload: {}
  } as const
}

// Action types derived from action creators
type StartedFeedWorkerAction = ReturnType<typeof startedFeedWorker>
type FinishedFeedWorkerAction = ReturnType<typeof finishedFeedWorker>

export type WorkersAction = StartedFeedWorkerAction | FinishedFeedWorkerAction

const initialState: WorkersState = {
  feedWorkers: 0
}

const reducer = (state = initialState, action: WorkersAction): WorkersState => {
  switch (action.type) {
    case START_FEED_WORKER:
      return { ...state, feedWorkers: state.feedWorkers + 1 }
    case FINISH_FEED_WORKER:
      return { ...state, feedWorkers: state.feedWorkers - 1 }
    default:
      return state
  }
}

const selectors = {
  hasFeedWorkers: (state: RootState): boolean => state[name].feedWorkers > 0
}

export default {
  name,
  reducer,
  selectors,
  serialize: false,
}
