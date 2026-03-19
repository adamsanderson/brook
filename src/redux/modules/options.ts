import type { RootState } from '../types'

export const SET_VIEW_MODE = "SET_VIEW_MODE" as const

const name = "options" as const

type ViewMode = 'sidebar' | 'popup'

type OptionsState = {
  viewMode: ViewMode
}

export type { OptionsState }

export function setViewMode(viewMode: ViewMode) {
  return {
    type: SET_VIEW_MODE,
    payload: { viewMode }
  } as const
}

// Action types derived from action creators
type SetViewModeAction = ReturnType<typeof setViewMode>

export type OptionsAction = SetViewModeAction

const initialState: OptionsState = {
  viewMode: 'sidebar'
}

const reducer = (state = initialState, action: OptionsAction): OptionsState => {
  switch (action.type) {
    case SET_VIEW_MODE:
      return {
        ...state,
        viewMode: action.payload.viewMode,
      }
    default:
      return state
  }
}

const selectors = {
  getViewMode: (state: RootState): ViewMode => {
    return state[name].viewMode
  }
}

export default {
  name,
  reducer,
  selectors,
  serialize: true,
}
