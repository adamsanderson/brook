export const RESET_DATA = "RESET_DATA"

export function resetData() {
  return {
    type: RESET_DATA
  }
}

export function resetableReducer(reducer, initialState={}) {
  return (state, action) => {  
    if (action.type === RESET_DATA) {
      state = initialState
    }
    
    return reducer(state, action)
  }
}