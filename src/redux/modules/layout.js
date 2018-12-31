import throttle from 'lodash/throttle'

export const UPDATE_WINDOW_DIMENSIONS = "UPDATE_WINDOW_DIMENSIONS"
export const DUAL_PANE = "dual_pane"
export const SINGLE_PANE = "single_pane"

const name = "layout"

// Register callback to listen for events in the proxy store's context (ie: Sidebar)
export function afterProxy(store) {
  const listener = throttle(
    (_event) => {
      store.dispatch(updateWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      }))
    }, 
    250 // Throttle period
  )
  
  addEventListener('resize', listener)
  
  // Immediately invoke listener
  listener()

  return listener
}

export function updateWindowDimensions(dimensions) {
  return {
    type: UPDATE_WINDOW_DIMENSIONS, 
    payload: dimensions
  }
}

const initialState = {
  width: undefined,
  height: undefined,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_WINDOW_DIMENSIONS:
      return { 
        ...state,
        width: action.payload.width,
        height: action.payload.height,
      } 
  }

  return state
}

const selectors = {
  getLayout: (state) => {
    const height = state[name].height
    if (height <= 360) {
      return SINGLE_PANE
    } else {
      return DUAL_PANE
    }
    
  }
}

export default {
  name,
  reducer,
  selectors,
  afterProxy,
}