export const CLOSE = "Modal/CLOSE"
export const OPEN  = "Modal/OPEN"

const name = __filename

export function closeModal() {
  return {
    type: CLOSE
  }
}

export function openModal(type, props) {
  return {
    type: OPEN,
    payload: {type: type, props: props}
  }
}

const initialState = {}

const reducer = (state = initialState, action) => {  
  switch (action.type) {
    case OPEN:
      return action.payload
    case CLOSE:
      return initialState
    
    default:
      return state
  }
}

const selectors = {
  modal: (state) => state[name]
}

export default {
  name,
  reducer,
  selectors,
}