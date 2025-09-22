import { Action, Reducer, Store } from "redux"

export const RESET_DATA = "RESET_DATA"

export function resetData() {
  return {
    type: RESET_DATA
  }
}

export function resetableReducer(reducer: Reducer, initialState: any) {
  return (state: Store, action: Action) => {  
    if (action.type === RESET_DATA) {
      state = initialState
    }
    
    return reducer(state, action)
  }
}