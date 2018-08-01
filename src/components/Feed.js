import React from 'react'
import PropTypes from 'prop-types'

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
      <div className={`Feed ${readClass} ${className}`} style={style} onClick={this.handleClick} >
        { this.props.onDelete &&
          <DeleteIcon className="Feed-action Icon" onClick={this.handleDelete}/>
        }
        <StatusIndicator isUnread={isUnread} hasError={!!error} isLoading={feed.isLoading}/>
        {error ? this.renderError(feed) : this.renderFeed(feed)}
      </div>
    )
  }

  renderError(feed) {
    return <span title={feed.error} className="hasError"> {feed.title} </span>
  }

  renderFeed(feed) {
    return <a title={feed.title}> {feed.title} </a>
  }

  handleClick(event) {
    this.props.onClick(this.props.feed)
  }

  handleDelete(event) {
    this.props.onDelete(this.props.feed)
  }
}

export default Feed