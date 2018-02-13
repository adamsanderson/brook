import { BEFORE, OVER, AFTER } from "../../constants"

export const HOVER_CLASSES = {
  [BEFORE]: "isHoveringBefore",
  [OVER]: "isHoveringOver",
  [AFTER]: "isHoveringAfter",
}

export function getDragItem(event) {
  const dataTransfer = event.dataTransfer
  const json = dataTransfer.getData("application/brook")

  if (json) {
    return JSON.parse(json)
  }
}

export function draggablePosition(event, inset = 0.2) {
  const boundingBox = event.target.getBoundingClientRect()
  const dragPosition = {
    x: event.clientX,
    y: event.clientY,
  }

  return relativePosition(boundingBox, dragPosition, inset)
}

function relativePosition(boundingBox, offset, inset) {
  const ratio = (offset.y - boundingBox.top) / boundingBox.height 

  if (ratio <= inset) {
    return BEFORE
  } else if (ratio >= 1 - inset) {
    return AFTER
  } else {
    return OVER
  }
}