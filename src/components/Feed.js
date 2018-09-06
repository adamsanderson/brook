import React from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

import StatusIndicator from '../components/icons/StatusIndicator'
import { XCircle as DeleteIcon } from 'react-feather'

class Feed extends React.Component {

  static propTypes = {
    feed: PropTypes.object.isRequired,
    isUnread: PropTypes.bool,
    onClick: PropTypes.func,
    onDelete: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string,
  }

  static defaultProps = {
    isUnread: false,
    onClick: (event) => true,
    className: "",
  }

  // Feeds are evaluated and rendered any time that the user interacts
  // with th feed tree.  Unfortunately not all props can be easily compared 
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
      (!isEqual(this.props.feed, nextProps.feed))
  }

  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  render() {
    const {feed, isUnread, style, className} = this.props
    const readClass = isUnread ? "isUnread" : "isRead"
    const error = feed.error

    return (
      <a 
        className={`Feed ${readClass} ${className}`} 
        style={style} 
        onClick={this.handleClick}
        href={feed.url}
      >
        { this.props.onDelete &&
          <DeleteIcon className="Feed-action Icon" onClick={this.handleDelete}/>
        }
        <StatusIndicator isUnread={isUnread} hasError={!!error} isLoading={feed.isLoading}/>
        {error ? this.renderError(feed) : this.renderFeed(feed)}
      </a>
    )
  }

  renderError(feed) {
    return <span title={feed.error} className="hasError"> {feed.title} </span>
  }

  renderFeed(feed) {
    return <a title={feed.title}> {feed.title} </a>
  }

  handleClick(event) {
    event.preventDefault()
    this.props.onClick(this.props.feed)
  }

  handleDelete(event) {
    this.props.onDelete(this.props.feed)
  }
}

export default Feed