export const UI_SHOW  = "Toast/UI_SHOW"
export const SHOW  = "Toast/SHOW"
export const HIDE  = "Toast/HIDE"

// Time to keep a toast visible by default:
const TOAST_DURATION = 5000 

const name = "toast"

export function hideToast(delay=TOAST_DURATION) {
  return {
    type: HIDE,
    meta: {
      delay
    }
  }
}

export function showToast(type, props={}, duration=TOAST_DURATION) {
  return {
    type: UI_SHOW,
    payload: { 
      type, 
      props, 
      duration 
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

const initialState = {}

const reducer = (state = initialState, action) => {  
  switch (action.type) {
    case SHOW:
      return action.payload
    case HIDE:
      return initialState
    
    default:
      return state
  }
}

const selectors = {
  toast: (state) => state[name]
}

export default {
  name,
  reducer,
  selectors,
}