import { rightAlignedBelow } from "../../lib/position"
export const CLOSE = "Modal/CLOSE"
export const OPEN  = "Modal/OPEN"

const name = "modal"

export function closeModal() {
  return {
    type: CLOSE
  }
}

export function openModal(type, props={}) {
  return {
    type: OPEN,
    payload: {type: type, props: props}
  }
}

export function openModalRightAlignedBelow(element, type, props={}) {
  const position = rightAlignedBelow(element)

  return {
    type: OPEN,
    payload: {type: type, props: {...props, position}}
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