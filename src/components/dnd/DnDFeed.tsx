import React from 'react'

import Feed from '../Feed'
import { OVER, type PositionType } from '../../constants'
import type { Feed as FeedType, NodeRef } from '../../redux/types'
import { HOVER_CLASSES, getDragItem, draggablePosition } from "./position"

type FeedProps = React.ComponentProps<typeof Feed>

type Props = FeedProps & {
  onDrop: (source: NodeRef, target: NodeRef, position: PositionType) => void
  allowDrop: (source: NodeRef, target: NodeRef) => boolean
  feed: FeedType
  className?: string
}

type State = {
  position?: PositionType
}

class DnDFeed extends React.Component<Props, State> {
  state: State = {
    position: undefined,
  }

  render() {
    const { className, onDrop, allowDrop, ...feedProps } = this.props
    const position = this.state.position
    const hoverClassName = HOVER_CLASSES[position as PositionType]

    return (
      <div
        onDragStart={this.handleDragStart}
        draggable={true}
        onDragOver={this.handleDragOver}
        onDragLeave={this.handleDragLeave}
        onDrop={this.handleDrop}
      >
        <Feed
          { ...feedProps }
          className={ [className, hoverClassName].filter(Boolean).join(" ") }
        />
      </div>
    )
  }

  handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("text/html", String(event.currentTarget))
    event.dataTransfer.setData("application/brook", JSON.stringify(this.props.feed))
    event.dataTransfer.effectAllowed = "move"
  }

  handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    const item = getDragItem(event)
    const position = this.state.position ?? OVER
    const feed = this.props.feed as NodeRef

    if (item) {
      this.props.onDrop(item, feed, position)
    }

    this.setState({ position: undefined })
  }

  handleDragLeave = () => {
    this.setState({ position: undefined })
  }

  handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    const item = getDragItem(event)
    if (item && this.props.allowDrop(item, this.props.feed as NodeRef)) {
      this.setState({ position: draggablePosition(event, 0.5) })
      event.preventDefault()
    }
  }
}

export default DnDFeed
