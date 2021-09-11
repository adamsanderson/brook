import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { markAllItemsViewed } from '../redux/modules/views'
import { clearSelection } from '../redux/modules/ui'
import { openModalRightAlignedBelow } from '../redux/modules/modal'

import MarkReadIcon from 'react-feather/dist/icons/check-circle'
import MenuIcon from 'react-feather/dist/icons/more-vertical'
import { MODALS } from '../modals'
import feeds from '../redux/modules/feeds'

class FeedDetailToolbar extends React.PureComponent {

  static propTypes = {
    feed: PropTypes.object.isRequired,
    itemNodes: PropTypes.array.isRequired,
    markAllItemsViewed: PropTypes.func.isRequired,
    clearSelection: PropTypes.func.isRequired,
    openModalRightAlignedBelow: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.handleMarkAllRead = this.handleMarkAllRead.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleMenu = this.handleMenu.bind(this)
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
        <span>
          <MenuIcon className="Icon" onClick={ this.handleMenu } />
        </span>
      </div>
    )
  }

  renderTitle(feed) {
    const title = feeds.selectors.getFeedTitle(feed)
    if (!title) return "Articles"

    return <a href={feed.linkUrl}>{title}</a>
  }

  handleMarkAllRead() {
    this.props.markAllItemsViewed(this.props.feed)
  }

  handleBack() {
    this.props.clearSelection()
  }

  handleMenu(event) {
    const feed = this.props.feed
    const el = event.target
    this.props.openModalRightAlignedBelow(el, MODALS.FeedMenu, {
      feed
    })
  }
}

const mapStateToProps = (state, props) => ({
  // state…
})

export default connect(mapStateToProps, {
  markAllItemsViewed,
  clearSelection,
  openModalRightAlignedBelow,
})(FeedDetailToolbar)