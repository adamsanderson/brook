
/**
 * Returns a set of styles that will position a fixed element relative to the
 * `target` passed in.  The alignment option positions the new element relative 
 * to the `target`, ie: `{"top": "bottom", "right": "right"}` will position the
 * new element's top to the bottom of the `target, and its right to the 
 * right of the `target`.  
 * 
 * Numeric offsets may be specified for each side as well.
 * 
 * @param {*} target to be positioned relative to
 * @param {*} align new element to origin element
 * @param {*} offsets numeric offsets
 */
export function relativePosition(target, align, offsets = {}) {
  const rect = target.getBoundingClientRect()
  const style = {}

  Object.keys(align).forEach(side => {
    const source = align[side]
    style[side] = rect[source] + (offsets[source] || 0)
    if (side === "right") {
      style[side] = document.body.clientWidth - style[side]
    } else if (side === "bottom") {
      style[side] = document.body.clientHeight - style[side]
    }
  })

  return style
}

export function rightAlignedBelow(target) {
  return relativePosition(target, {"top": "bottom", "right": "right"}, {top: 5})
}