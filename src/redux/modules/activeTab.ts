import type { RootState } from '../types'

export const CHANGE_TAB = "CHANGE_TAB" as const

const name = "activeTab" as const

type ActiveTabState = {
  activeTabId: number | undefined
}

export type { ActiveTabState }

export function changeTab(tabId: number) {
  return {
    type: CHANGE_TAB,
    payload: { tabId }
  } as const
}

// Action types derived from action creators
type ChangeTabAction = ReturnType<typeof changeTab>

type ActiveTabAction = ChangeTabAction

const initialState: ActiveTabState = {
  activeTabId: undefined
}

const reducer = (state = initialState, action: ActiveTabAction): ActiveTabState => {
  switch (action.type) {
    case CHANGE_TAB:
      return {
        ...state,
        activeTabId: action.payload.tabId
      }
    default:
      return state
  }
}

const selectors = {
  getActiveTabId: (state: RootState): number | undefined => {
    return state[name].activeTabId
  }
}

export default {
  name,
  reducer,
  selectors,
}