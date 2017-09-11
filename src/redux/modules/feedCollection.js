import feeds, { ADD_FEED, REMOVE_FEED } from './feeds'

const name = __filename

const initialState = [
  "1", "2"
]

const reducer = (state = initialState, action) => {  
  switch (action.type) {
    case ADD_FEED:
      return [...state, action.payload.feed.id]
    case REMOVE_FEED:
      return state.filter(f => id != action.payload.feed.id)
    default:
      return state
  }
}

const selectors = {
  all: (state) => {
    const entities = state[feeds.name]
    return state[name].map(id => entities[id])
  }
}

export default {
  name,
  reducer,
  selectors
}