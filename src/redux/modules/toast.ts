import { ThunkAction } from 'redux-thunk'
import { DELAYED_ACTION } from "../middleware/timeoutScheduler"
import type { RootState } from '../types'

export const SHOW = "Toast/SHOW" as const
export const HIDE = "Toast/HIDE" as const
export const HOLD = "Toast/HOLD" as const
export const RELEASE = "Toast/RELEASE" as const

const NONE = {} as const

// Time to keep a toast visible by default:
const DEFAULT_DURATION = 5000
const RELEASE_TIMEOUT = 2000

const name = "toast" as const

type ToastPayload = {
  type: string
  props: Record<string, any>
} | typeof NONE

type ToastState = {
  isHeld: boolean
  toast: ToastPayload
}

export type { ToastState }

export function hideToast(delay: number = DEFAULT_DURATION) {
  return {
    type: HIDE,
    meta: {
      delay
    }
  } as const
}

export function hideToastNow() {
  return {
    type: HIDE
  } as const
}

export function showToast(type: string, props: Record<string, any> = {}, duration: number = DEFAULT_DURATION): ToastThunk {
  return (dispatch, _getState) => {
    dispatch({
      type: SHOW,
      payload: {
        type,
        props
      }
    })

    dispatch(hideToast(duration))
  }
}

export function holdToast() {
  return {
    type: HOLD
  } as const
}

export function releaseToast() {
  return {
    type: RELEASE,
    meta: {
      delay: RELEASE_TIMEOUT
    }
  } as const
}

// Action types derived from action creators
type HideToastAction = ReturnType<typeof hideToast>
type HideToastNowAction = ReturnType<typeof hideToastNow>
type HoldToastAction = ReturnType<typeof holdToast>
type ReleaseToastAction = ReturnType<typeof releaseToast>

// Manual action types
type ShowToastAction = {
  type: typeof SHOW
  payload: ToastPayload
}

type DelayedAction = {
  type: typeof DELAYED_ACTION
  payload: {
    action: {
      type: string
    }
  }
}

type ToastAction =
  | ShowToastAction
  | HideToastAction
  | HideToastNowAction
  | HoldToastAction
  | ReleaseToastAction
  | DelayedAction

type ToastThunk<T = void> = ThunkAction<T, RootState, unknown, ToastAction>

const initialState: ToastState = {
  isHeld: false,
  toast: NONE,
}

const reducer = (state = initialState, action: ToastAction): ToastState => {
  switch (action.type) {
    case SHOW:
      return { ...state, toast: action.payload }
    case HIDE:
      if (state.isHeld && 'meta' in action && action.meta && action.meta.delay) {
        return state
      } else {
        return { ...state, toast: NONE }
      }
    case HOLD:
      return { ...state, isHeld: true }
    case RELEASE:
      if (state.isHeld) {
        return state
      } else {
        return { ...state, isHeld: false, toast: NONE }
      }
    case DELAYED_ACTION:
      if (action.payload.action.type === RELEASE) {
        return { ...state, isHeld: false }
      } else {
        return state
      }
    default:
      return state
  }
}

const selectors = {
  toast: (state: RootState): ToastPayload => state[name].toast
}

export default {
  name,
  reducer,
  selectors,
}