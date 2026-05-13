import type { DragEvent } from 'react'

import { BEFORE, OVER, AFTER, type PositionType } from "../../constants"
import type { NodeRef } from '../../redux/types'

export const HOVER_CLASSES: Record<PositionType, string> = {
  [BEFORE]: "isHoveringBefore",
  [OVER]: "isHoveringOver",
  [AFTER]: "isHoveringAfter",
}

// Chrome blocks dataTransfer reads during dragover, so we track the active item
// in module state set at dragstart and cleared at dragend.
//
// Thanks Chrome.
let activeDragItem: NodeRef | undefined

export function setDragItem(item: NodeRef): void {
  activeDragItem = item
}

export function clearDragItem(): void {
  activeDragItem = undefined
}

export function getDragItem(): NodeRef | undefined {
  return activeDragItem
}

export function draggablePosition(event: DragEvent<Element>, inset = 0.2): PositionType {
  const target = event.target as HTMLElement
  const boundingBox = target.getBoundingClientRect()
  const dragPosition = {
    x: event.clientX,
    y: event.clientY,
  }

  return relativePosition(boundingBox, dragPosition, inset)
}

function relativePosition(
  boundingBox: DOMRect,
  offset: { x: number; y: number },
  inset: number
): PositionType {
  const ratio = (offset.y - boundingBox.top) / boundingBox.height

  if (ratio <= inset) {
    return BEFORE
  }

  if (ratio >= 1 - inset) {
    return AFTER
  }

  return OVER
}
