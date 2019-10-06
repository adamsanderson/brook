
export const SET_VIEW_MODE = "SET_VIEW_MODE"

const name = "options"

export function setViewMode(viewMode) {
  return {
    type: SET_VIEW_MODE,
    payload: { viewMode }
  }
}

const initialState = {
  viewMode: 'sidebar'
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_VIEW_MODE:
      return {
          ...state,
          viewMode: action.payload.viewMode,
      }
    default:
      return state
  }
}

const selectors = {
  getViewMode: (state) => {
    return state[name].viewMode
  }
}

export default {
  name,
  reducer,
  selectors,
  serialize: true,
}