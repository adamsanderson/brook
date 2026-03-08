import React from 'react'

import Feed from '../Feed'
import { type PositionType } from '../../constants'
import type { Feed as FeedType, NodeRef } from '../../redux/types'
import { HOVER_CLASSES, getDragItem, draggablePosition } from "./position"

type FeedProps = React.ComponentProps<typeof Feed>

type Props = FeedProps & {
  onDrop: (item: NodeRef, feed: FeedType, position: PositionType | undefined, event: React.DragEvent<HTMLDivElement>) => void
  allowDrop: (item: NodeRef, feed: FeedType) => boolean
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
    const position = this.state.position
    const feed = this.props.feed

    if (item) {
      this.props.onDrop(item, feed, position, event)
    }

    this.setState({ position: undefined })
  }

  handleDragLeave = () => {
    this.setState({ position: undefined })
  }

  handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    const item = getDragItem(event)
    if (item && this.props.allowDrop(item, this.props.feed)) {
      this.setState({ position: draggablePosition(event, 0.5) })
      event.preventDefault()
    }
  }
}

export default DnDFeed
