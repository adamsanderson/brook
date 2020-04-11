import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { markAllItemsViewed } from '../redux/modules/views'
import { clearSelection } from '../redux/modules/ui'

import MarkReadIcon from 'react-feather/dist/icons/check-circle'

class FeedDetailToolbar extends React.PureComponent {

  static propTypes = {
    feed: PropTypes.object.isRequired,
    itemNodes: PropTypes.array.isRequired,
    markAllItemsViewed: PropTypes.func.isRequired,
    clearSelection: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.handleMarkAllRead = this.handleMarkAllRead.bind(this)
    this.handleBack = this.handleBack.bind(this)
  }

  render() {
    const {feed, itemNodes} = this.props

    return (
      <div className="Panel-header">
        <span>
          {this.renderTitle(feed)}
        </span>
        <span>
          {
            itemNodes.some(i => i.isUnread) && 
            <MarkReadIcon className="Icon" onClick={this.handleMarkAllRead} />
          }
        </span>
      </div>
    )
  }

  renderTitle(feed) {
    if (!feed.title) return "Articles"

    return <a href={feed.linkUrl}>{feed.title}</a>
  }

  handleMarkAllRead() {
    this.props.markAllItemsViewed(this.props.feed)
  }

  handleBack() {
    this.props.clearSelection()
  }
}

const mapStateToProps = (state, props) => ({
  // state…
})

export default connect(mapStateToProps, {
  markAllItemsViewed,
  clearSelection
})(FeedDetailToolbar)