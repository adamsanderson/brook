export const START_FEED_WORKER = "START_FEED_WORKER"
export const FINISH_FEED_WORKER = "FINISH_FEED_WORKER"

const name = "workers"

export function startedFeedWorker() {
  return {
    type: START_FEED_WORKER,
    payload: { }
  }
}

export function finishedFeedWorker() {
  return {
    type: FINISH_FEED_WORKER,
    payload: { }
  }
}

const initialState = {
  feedWorkers: 0
}

const reducer = (state = initialState, action) => {  
  switch (action.type) {
    case START_FEED_WORKER:
      return {...state, feedWorkers: state.feedWorkers + 1}
    case FINISH_FEED_WORKER:
      return {...state, feedWorkers: state.feedWorkers - 1}
    default:
      return state
  }
}

const selectors = {
  hasFeedWorkers: (state) => state[name].feedWorkers > 0
}

export default {
  name,
  reducer,
  selectors,
  serialize: false,
}