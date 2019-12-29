import React from 'react'
import PropTypes from 'prop-types'

import Watch from '../Watch'
import { HOVER_CLASSES, getDragItem, draggablePosition } from "./position"

class DnDWatch extends React.Component {
  static propTypes = {
    onDrop: PropTypes.func.isRequired,
    allowDrop: PropTypes.func.isRequired,
    watch: PropTypes.object.isRequired,
    className: PropTypes.string,
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
        <Watch 
          { ...props } 
          className={ [className, hoverClassName].join(" ") }   
        />
      </div>
    )
  }

  handleDragStart(event) {
    event.dataTransfer.setData("text/html", event.currentTarget)
    event.dataTransfer.setData("application/brook", JSON.stringify(this.props.watch))
    event.dataTransfer.effectAllowed = "move"
  }

  handleDrop(event) {
    const item = getDragItem(event)
    const position = this.state.position
    const watch = this.props.watch
    this.props.onDrop(item, watch, position, event)

    this.setState({position: undefined})
  }

  handleDragLeave(event) {
    this.setState({position: undefined})
  }

  handleDragOver(event) {
    const item = getDragItem(event)
    if (item && this.props.allowDrop(item, this.props.watch)) {
      this.setState({position: draggablePosition(event, 0.5)})
      event.preventDefault()
    }
  }
}

export default DnDWatch