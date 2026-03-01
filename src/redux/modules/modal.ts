// @ts-expect-error migration
import { leftAlignedBelow, rightAlignedBelow } from "../../lib/position"
import type { RootState } from '../types'

export const CLOSE = "Modal/CLOSE" as const
export const OPEN = "Modal/OPEN" as const

const name = "modal" as const

type Position = {
  top?: number
  bottom?: number
  left?: number
  right?: number
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type EmptyObject = {}

type ModalState = {
  type?: string
  props?: Record<string, unknown> & {
    position?: Position
  }
} | EmptyObject

export type { ModalState }

export function closeModal() {
  return {
    type: CLOSE
  } as const
}

export function openModal(type: string, props: object = {}) {
  return {
    type: OPEN,
    payload: { type, props }
  } as const
}

export function openModalRightAlignedBelow(element: Element, type: string, props: object = {}) {
  const position = rightAlignedBelow(element)

  return {
    type: OPEN,
    payload: { type, props: { ...props, position } }
  } as const
}

export function openModalLeftAlignedBelow(element: Element, type: string, props: object = {}) {
  const position = leftAlignedBelow(element)

  return {
    type: OPEN,
    payload: { type, props: { ...props, position } }
  } as const
}

// Action types derived from action creators
type CloseModalAction = ReturnType<typeof closeModal>
type OpenModalAction = ReturnType<typeof openModal>
type OpenModalRightAlignedBelowAction = ReturnType<typeof openModalRightAlignedBelow>
type OpenModalLeftAlignedBelowAction = ReturnType<typeof openModalLeftAlignedBelow>

type ModalAction =
  | CloseModalAction
  | OpenModalAction
  | OpenModalRightAlignedBelowAction
  | OpenModalLeftAlignedBelowAction

const initialState: ModalState = {}

const reducer = (state = initialState, action: ModalAction): ModalState => {
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
  modal: (state: RootState): ModalState => state[name]
}

export default {
  name,
  reducer,
  selectors,
}