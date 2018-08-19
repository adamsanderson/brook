import { DELAYED_ACTION } from "../middleware/timeoutScheduler"

export const UI_SHOW  = "Toast/UI_SHOW"
export const SHOW  = "Toast/SHOW"
export const HIDE  = "Toast/HIDE"
export const HOLD  = "Toast/HOLD"
export const RELEASE  = "Toast/RELEASE"

// Time to keep a toast visible by default:
const DEFAULT_DURATION = 5000 
const RELEASE_TIMEOUT = 2000 

const name = "toast"

export function hideToast(delay=DEFAULT_DURATION) {
  return {
    type: HIDE,
    meta: {
      delay
    }
  }
}

export function showToast(type, props={}, duration=DEFAULT_DURATION) {
  return {
    type: UI_SHOW,
    payload: { 
      type, 
      props, 
      duration 
    }
  }
}

export function holdToast() {
  return {
    type: HOLD
  }
}

export function releaseToast() {
  return {
    type: RELEASE,
    meta: {
      delay: RELEASE_TIMEOUT
    }
  }
}

export function backendShowToast(action) {
  return (dispatch, getState) => {
    const {type, props, duration} = action.payload
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

const initialState = {
  isHeld: false,
  toast: undefined,
}

const reducer = (state = initialState, action) => {  
  switch (action.type) {
    case SHOW:
      return {...state, toast: action.payload}
    case HIDE:
      if (state.isHeld) {
        return state
      } else {
        return {...state, toast: undefined}
      }
    case HOLD:
      return {...state, isHeld: true}
    case RELEASE:
      if (state.isHeld) {
        return state
      } else {
        return {...state, isHeld: false, toast: undefined}
      }
    case DELAYED_ACTION: 
      if (action.payload.action.type === RELEASE) {
        return {...state, isHeld: false}
      } else {
        return state
      }
    default:
      return state
  }
}

const selectors = {
  toast: (state) => state[name].toast
}

export default {
  name,
  reducer,
  selectors,
}