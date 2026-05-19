import type { RootState } from '../types'

export const CHANGE_TAB = "CHANGE_TAB" as const

const name = "activeTab" as const

type ActiveTabState = {
  activeTabId: number | undefined
  activeUrl: string | undefined
}

export type { ActiveTabState }

export function changeTab(payload: {tabId: number, url?: string}) {
  return {
    type: CHANGE_TAB,
    payload,
  } as const
}

// Action types derived from action creators
type ChangeTabAction = ReturnType<typeof changeTab>

export type ActiveTabAction = ChangeTabAction

const initialState: ActiveTabState = {
  activeTabId: undefined,
  activeUrl: undefined,
}

const reducer = (state = initialState, action: ActiveTabAction): ActiveTabState => {
  switch (action.type) {
    case CHANGE_TAB:
      return {
        ...state,
        activeTabId: action.payload.tabId,
        activeUrl: action.payload.url
      }
    default:
      return state
  }
}

const selectors = {
  getActiveTabId: (state: RootState): number | undefined => {
    return state[name].activeTabId
  },
  getActiveUrl: (state: RootState): string | undefined => {
    return state[name].activeUrl
  }
}

export default {
  name,
  reducer,
  selectors,
}
