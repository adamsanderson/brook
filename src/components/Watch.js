import React from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

import StatusIndicator from '../components/icons/StatusIndicator'
import DeleteIcon from 'react-feather/dist/icons/x-circle'

class Watch extends React.Component {

  static propTypes = {
    watch: PropTypes.object.isRequired,
    isUnread: PropTypes.bool,
    onClick: PropTypes.func,
    onDelete: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string,
  }

  static defaultProps = {
    isUnread: false,
    className: "",
  }

  // Watches are evaluated and rendered any time that the user interacts
  // with the feed tree.  Unfortunately not all props can be easily compared 
  // since the drag an drop wrapper's `allowDrop` is regenerated on each render.
  //
  // To work around this for now, we implement a custom `shouldComponentUpdate`.
  shouldComponentUpdate(nextProps) {
    if (this.props === nextProps) return false
    
    return (this.props.className !== nextProps.className) ||
      (this.props.style !== nextProps.style) ||
      (this.props.onDelete !== nextProps.onDelete) ||
      (this.props.onClick !== nextProps.onClick) ||
      (this.props.isUnread !== nextProps.isUnread) ||
      (!isEqual(this.props.watch, nextProps.watch))
  }

  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  render() {
    const {watch, isUnread, style, className} = this.props
    const readClass = isUnread ? "isUnread" : "isRead"
    const error = watch.error

    return (
      <div 
        className={`Feed ${readClass} ${className}`} 
        style={style} 
        onClick={this.handleClick}
      >
        { this.props.onDelete &&
          <DeleteIcon className="Feed-action Icon" onClick={this.handleDelete}/>
        }
        <StatusIndicator isUnread={isUnread} hasError={!!error} isLoading={watch.isLoading}/>
        {error ? this.renderError(watch) : this.renderWatch(watch)}
      </div>
    )
  }

  renderWatch(watch) {
    return (
      <a href={watch.url} title={watch.title}>
        {watch.title}
      </a>
    )
  }

  renderError(watch) {
    return (
      <a href={watch.url} title={watch.title} className="hasError">
        {watch.title}
      </a>
    )
  }

  handleClick(event) {
    if (this.props.onClick) {
      this.props.onClick(this.props.watch)
    }
  }

  handleDelete(event) {
    this.props.onDelete(this.props.watch)
  }
}

export default Watch