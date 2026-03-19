import type { DragEvent } from 'react'

import { BEFORE, OVER, AFTER, type PositionType } from "../../constants"
import type { NodeRef } from '../../redux/types'

export const HOVER_CLASSES: Record<PositionType, string> = {
  [BEFORE]: "isHoveringBefore",
  [OVER]: "isHoveringOver",
  [AFTER]: "isHoveringAfter",
}

export function getDragItem(event: DragEvent<Element>): NodeRef | undefined {
  const json = event.dataTransfer.getData("application/brook")

  if (json) {
    return JSON.parse(json) as NodeRef
  }

  return undefined
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
