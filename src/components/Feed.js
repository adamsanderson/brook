import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'

import StatusIndicator from '../components/icons/StatusIndicator'

class Feed extends Component {

  static propTypes = {
    feed: PropTypes.object.isRequired,
    isUnread: PropTypes.bool,
    onClick: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string,
  }

  static defaultProps = {
    isUnread: false,
    onClick: (event) => true,
    className: "",
  }

  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    const {feed, isUnread, style, className} = this.props
    const readClass = isUnread ? "isUnread" : "isRead"
    const error = feed.error

    return (
      <div className={`Feed ${readClass} ${className}`} style={style} onClick={this.handleClick} > 
        <StatusIndicator isUnread={isUnread} hasError={!!error} />
        {error ? this.renderError(feed) : this.renderFeed(feed)}
      </div>
    )
  }

  renderError(feed) {
    return <span title={feed.error} className="hasError"> {feed.title} </span>
  }

  renderFeed(feed) {
    return <span title={feed.title}> {feed.title} </span>
  }

  handleClick(event) {
    this.props.onClick(this.props.feed)
  }
}

export default Feed