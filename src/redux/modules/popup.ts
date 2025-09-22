import feeds from './feeds'
import type { RootState } from '../types'

export const OPEN_POPUP = "OPEN_POPUP" as const
export const CLOSE_POPUP = "CLOSE_POPUP" as const

const name = "popup" as const

type PopupState = {
  openedAt: number
  isOpen: boolean
}

export type { PopupState }

export function openPopup() {
  return {
    type: OPEN_POPUP,
  } as const
}

export function closePopup() {
  return {
    type: CLOSE_POPUP,
  } as const
}

// Action types derived from action creators
type OpenPopupAction = ReturnType<typeof openPopup>
type ClosePopupAction = ReturnType<typeof closePopup>

type PopupAction = OpenPopupAction | ClosePopupAction

const initialState: PopupState = {
  openedAt: 0,
  isOpen: false,
}

const reducer = (state = initialState, action: PopupAction): PopupState => {
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
  isUnread: (state: RootState): boolean => {
    return feeds.selectors.allFeeds(state).some(feed => feed.updatedAt > (state[name].openedAt))
  },
}

export default {
  name,
  reducer,
  selectors,
  serialize: true,
}