import React from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

import StatusIndicator from '../components/icons/StatusIndicator'
import feeds from '../redux/modules/feeds'
import FeedEditor from './FeedEditor'

class Feed extends React.Component {

  static propTypes = {
    feed: PropTypes.object.isRequired,
    isUnread: PropTypes.bool,
    onClick: PropTypes.func,
    onRename: PropTypes.func,
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
      (this.props.onClick !== nextProps.onClick) ||
      (this.props.isUnread !== nextProps.isUnread) ||
      (!isEqual(this.props.feed, nextProps.feed))
  }

  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  render() {
    const { feed, isUnread, style, className, onRename } = this.props
    const readClass = isUnread ? "isUnread" : "isRead"
    const error = feed.error

    return (
      <div
        className={`Feed ${readClass} ${className}`}
        style={style}
        onClick={this.handleClick}
      >
        <StatusIndicator isUnread={isUnread} hasError={!!error} isLoading={feed.isLoading} />
        {
          feed.isEditing
            ? <FeedEditor feed={feed} onRename={onRename} />
            : error ? this.renderError(feed) : this.renderFeed(feed)
        }
        {}
      </div>
    )
  }

  renderError(feed) {
    const title = feeds.selectors.getFeedTitle(feed)
    return this.renderFeedElement({ title: feed.error, className: "hasError", href: feed.url, children: title })
  }

  renderFeed(feed) {
    const title = feeds.selectors.getFeedTitle(feed)
    return this.renderFeedElement({
      title,
      href: feed.url,
      children: title
    })
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
}

function noopLinkHandler(event) {
  event.preventDefault()
}

export default Feed