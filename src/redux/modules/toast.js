export const SHOW  = "Toast/SHOW"
export const HIDE  = "Toast/HIDE"

const name = "toast"

export function hideToast() {
  return {
    type: HIDE
  }
}

export function showToast(type, props={}) {
  return {
    type: SHOW,
    payload: {type: type, props: props}
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