import React from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

import StatusIndicator from '../components/icons/StatusIndicator'
import DeleteIcon from 'react-feather/dist/icons/x-circle'

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
      <div 
        className={`Feed ${readClass} ${className}`} 
        style={style} 
        onClick={this.handleClick}
      >
        { this.props.onDelete &&
          <DeleteIcon className="Feed-action Icon" onClick={this.handleDelete}/>
        }
        <StatusIndicator isUnread={isUnread} hasError={!!error} isLoading={feed.isLoading}/>
        {error ? this.renderError(feed) : this.renderFeed(feed)}
      </div>
    )
  }

  renderError(feed) {
    return this.renderFeedElement({title: feed.error, className: "hasError", href: feed.url, children: feed.title})
  }

  renderFeed(feed) {
    return this.renderFeedElement({title: feed.title, href: feed.url, children: feed.title})
  }

  // renderFeedElement allows us to switch the element easily based on whether there's a onClick handler.
  renderFeedElement(attrs) {
    if (this.props.onClick) {
      return <a {...attrs} onClick={noopLinkHandler} />
    } else {
      return <span {...attrs} />
    }
  }

  handleClick(event) {
    if (this.props.onClick) {
      this.props.onClick(this.props.feed)
    }
  }

  handleDelete(event) {
    this.props.onDelete(this.props.feed)
  }
}

function noopLinkHandler(event) {
  event.preventDefault()
}

export default Feed