import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { openModalRightAlignedBelow } from '../redux/modules/modal'
import views, { markAllItemsViewed } from '../redux/modules/views'
import { MODALS } from '../modals'

import { 
  MoreVertical as MenuIcon,
  CheckCircle as MarkReadIcon,
 } from 'react-feather'

class FeedDetailToolbar extends React.Component {

  static propTypes = {
    feed: PropTypes.object.isRequired,
    openModalRightAlignedBelow: PropTypes.func.isRequired,
    markAllItemsViewed: PropTypes.func.isRequired,
    isItemUnread: PropTypes.func
  }

  static defaultProps = {
    isItemUnread: (item) => false,
  }

  constructor(props) {
    super(props)
    this.handleMenu = this.handleMenu.bind(this)
    this.handleMarkAllRead = this.handleMarkAllRead.bind(this)
  }

  render() {
    return (
      <span>
        {
          this.props.feed.items &&  
          this.props.feed.items.some(this.props.isItemUnread) && 
          <MarkReadIcon className="Icon" onClick= { this.handleMarkAllRead } />
        }
        <MenuIcon className="Icon" onClick={ this.handleMenu } />
      </span>
    )
  }

  handleMenu(event) {
    const el = event.target
    this.props.openModalRightAlignedBelow(el, MODALS.FeedDetailMenu, {
      feed: this.props.feed, 
    })
  }

  handleMarkAllRead() {
    this.props.markAllItemsViewed(this.props.feed)
  }
}

const mapStateToProps = (state, props) => ({
  isItemUnread: views.selectors.isItemUnread(state)
})

export default connect(mapStateToProps, {
  openModalRightAlignedBelow,
  markAllItemsViewed
})(FeedDetailToolbar)