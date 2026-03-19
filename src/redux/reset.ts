import { type Action, type Reducer } from "redux"

export const RESET_DATA = "RESET_DATA"

export function resetData() {
  return {
    type: RESET_DATA
  }
}

export function resetableReducer<S, A extends Action = Action>(
  reducer: Reducer<S, A>,
  initialState: S | Partial<S>
): Reducer<S, A | ReturnType<typeof resetData>> {
  return (state: S | undefined, action: A | ReturnType<typeof resetData>) => {
    if (action.type === RESET_DATA) {
      state = initialState as S
    }

    return reducer(state, action as A)
  }
}
