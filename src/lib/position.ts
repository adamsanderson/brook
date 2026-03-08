export type Position = {
  top?: number
  bottom?: number
  left?: number
  right?: number
}

type Side = keyof Position
type Alignment = Partial<Record<Side, Side>>

/**
 * Returns a set of styles that will position a fixed element relative to the
 * `target` passed in.  The alignment option positions the new element relative
 * to the `target`, ie: `{"top": "bottom", "right": "right"}` will position the
 * new element's top to the bottom of the `target, and its right to the
 * right of the `target`.
 *
 * Numeric offsets may be specified for each side as well.
 *
 * @param target to be positioned relative to
 * @param align new element to origin element
 * @param offsets numeric offsets
 */
export function relativePosition(target: Element, align: Alignment, offsets: Position = {}): Position {
  const rect = target.getBoundingClientRect()
  const style: Position = {}

  Object.keys(align).forEach((key) => {
    const side = key as Side
    const source = align[side]
    if (!source) return

    style[side] = rect[source] + (offsets[source] || 0)
    if (side === 'right') {
      style[side] = document.body.clientWidth - (style[side] || 0)
    } else if (side === 'bottom') {
      style[side] = document.body.clientHeight - (style[side] || 0)
    }
  })

  return style
}

export function rightAlignedBelow(target: Element): Position {
  return relativePosition(target, { top: 'bottom', right: 'right' }, { top: 5 })
}

export function leftAlignedBelow(target: Element): Position {
  return relativePosition(target, { top: 'bottom', left: 'left' }, { top: 5 })
}
