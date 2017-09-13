import { SELECT_FEED } from './ui'

const name = __filename

const initialState = {
  feedsViewedAt: {},
}

const reducer = (state = initialState, action) => {  
  switch (action.type) {
    case SELECT_FEED:
      const feed = action.payload.feed
      const feedsViewedAt = Object.assign({}, state.feedsViewedAt)
      feedsViewedAt[feed.id] = Date.now()
      return {...state, feedsViewedAt}

    default:
      return state
  }
}

const selectors = {
  isFeedUnread: (state) => {
    return (feed) => {
      const viewedAt = state[name].feedsViewedAt[feed.id] || 0
      return viewedAt < feed.updatedAt
    }
  },
}

export default {
  name,
  reducer,
  selectors
}