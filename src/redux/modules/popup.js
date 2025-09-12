import feeds from './feeds'

export const OPEN_POPUP = "OPEN_POPUP"
export const CLOSE_POPUP = "CLOSE_POPUP"

const name = "popup"

export function openPopup() {
  return {
    type: OPEN_POPUP,
  }
}

export function closePopup() {
    return {
      type: CLOSE_POPUP,
    }
  }

const initialState = {
  openedAt: 0,
  isOpen: false,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_POPUP:
      return {
          ...state,
          openedAt: Date.now(),
          isOpen: true,
      }
    case CLOSE_POPUP:
      return {
          ...state,
          isOpen: false,
      }
    default:
      return state
  }
}

const selectors = {
  isUnread: (state) => {
    return feeds.selectors.allFeeds(state).some(feed => feed.updatedAt > (state[name].openedAt))
  },
}

export default {
  name,
  reducer,
  selectors,
  serialize: true,
}