import React from 'react'

import Folder from '../Folder'
import { OVER, type PositionType } from '../../constants'
import type { Folder as FolderType, NodeRef } from '../../redux/types'
import { HOVER_CLASSES, getDragItem, setDragItem, clearDragItem, draggablePosition } from "./position"

type FolderProps = React.ComponentProps<typeof Folder>

type Props = FolderProps & {
  onDrop: (source: NodeRef, target: NodeRef, position: PositionType) => void
  allowDrop: (source: NodeRef, target: NodeRef) => boolean
  folder: FolderType
  className?: string
}

type State = {
  position?: PositionType
}

class DnDFolder extends React.Component<Props, State> {
  state: State = {
    position: undefined,
  }

  render() {
    const { className, onDrop, allowDrop, ...folderProps } = this.props
    const position = this.state.position
    const hoverClassName = HOVER_CLASSES[position as PositionType]

    return (
      <div
        draggable={true}
        onDragStart={this.handleDragStart}
        onDragEnd={this.handleDragEnd}
        onDragOver={this.handleDragOver}
        onDragLeave={this.handleDragLeave}
        onDrop={this.handleDrop}
      >
        <Folder
          { ...folderProps }
          className={ [className, hoverClassName].filter(Boolean).join(" ") }
        />
      </div>
    )
  }

  handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    setDragItem(this.props.folder)
    event.dataTransfer.setData("text/html", event.currentTarget.outerHTML)
    event.dataTransfer.effectAllowed = "move"
  }

  handleDragEnd = () => {
    clearDragItem()
  }

  handleDrop = () => {
    const item = getDragItem()
    const position = this.state.position ?? OVER
    const folder = this.props.folder as NodeRef

    if (item) {
      this.props.onDrop(item, folder, position)
    }

    this.setState({ position: undefined })
  }

  handleDragLeave = () => {
    this.setState({ position: undefined })
  }

  handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    const item = getDragItem()
    if (item && this.props.allowDrop(item, this.props.folder as NodeRef)) {
      this.setState({ position: draggablePosition(event, 0.2) })
      event.preventDefault()
    }
  }
}

export default DnDFolder
