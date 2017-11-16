import React, {Component, PropTypes} from 'react'

import Feed from '../Feed'
import { HOVER_CLASSES, getDragItem, draggablePosition } from "./position"

class DnDFeed extends React.Component {
  static propTypes = {
    onDrop: PropTypes.func.isRequired,
    allowDrop: PropTypes.func.isRequired,
    feed: PropTypes.object.isRequired,
  }  

  constructor(props) {
    super(props)
    this.handleDragStart = this.handleDragStart.bind(this)

    this.handleDragOver = this.handleDragOver.bind(this)
    this.handleDragLeave = this.handleDragLeave.bind(this)
    this.handleDrop = this.handleDrop.bind(this)

    this.state = {
      position: undefined,
    }
  }

  render() {
    const {className, ...props} = this.props
    const position = this.state.position
    const hoverClassName = HOVER_CLASSES[position]

    return (
      <div 
        onDragStart={this.handleDragStart}
        draggable={true}

        onDragOver={this.handleDragOver}
        onDragLeave={this.handleDragLeave}
        onDrop={this.handleDrop}
      >
        <Feed 
          { ...this.props } 
          className={ [className, hoverClassName].join(" ") }   
        />
      </div>
    )
  }

  handleDragStart(event) {
    event.dataTransfer.setData("text/html", event.currentTarget)
    event.dataTransfer.setData("application/brook", JSON.stringify(this.props.feed))
    event.dataTransfer.effectAllowed = "move"
  }

  handleDrop(event) {
    const item = getDragItem(event)
    const position = this.state.position
    const feed = this.props.feed
    this.props.onDrop(item, feed, position, event)

    this.setState({position: undefined})
  }

  handleDragLeave(event) {
    this.setState({position: undefined})
  }

  handleDragOver(event) {
    const item = getDragItem(event)
    if (item && this.props.allowDrop(item, this.props.feed)) {
      this.setState({position: draggablePosition(event, 0.5)})
      event.preventDefault()
    }
  }
}

export default DnDFeed