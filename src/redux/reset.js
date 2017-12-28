export const RESET_DATA = "RESET_DATA"

export function resetData() {
  return {
    type: RESET_DATA
  }
}

export function resetableReducer(reducer) {
  return (state, action) => {  
    if (action.type === RESET_DATA) {
      state = undefined
    }
    
    return reducer(state, action)
  }
}