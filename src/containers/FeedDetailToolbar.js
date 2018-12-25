import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import views, { markAllItemsViewed } from '../redux/modules/views'

import MarkReadIcon from 'react-feather/dist/icons/check-circle'

class FeedDetailToolbar extends React.PureComponent {

  static propTypes = {
    feed: PropTypes.object.isRequired,
    markAllItemsViewed: PropTypes.func.isRequired,
    isItemUnread: PropTypes.func
  }

  static defaultProps = {
    isItemUnread: (item) => false,
  }

  constructor(props) {
    super(props)
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
      </span>
    )
  }

  handleMarkAllRead() {
    this.props.markAllItemsViewed(this.props.feed)
  }
}

const mapStateToProps = (state, props) => ({
  isItemUnread: views.selectors.isItemUnread(state)
})

export default connect(mapStateToProps, {
  markAllItemsViewed
})(FeedDetailToolbar)