import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import PopupLayout from './layouts/PopupLayout'
import { removeFeed } from '../redux/modules/feeds'
import { markAllItemsViewed } from '../redux/modules/views'

class FeedDetailMenu extends React.Component {

  static propTypes = {
    feed: PropTypes.object.isRequired,
    position: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
    removeFeed: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.handleRemove = this.handleRemove.bind(this)
  }

  render() {    
    const { position, closeModal } = this.props
    
    return (
      <PopupLayout position={position} onClose={closeModal}>
        <div>
          <a onClick={ this.handleRemove }>Delete Feed</a>
        </div>
      </PopupLayout>
    )
  }

  handleRemove() {
    this.props.closeModal()
    this.props.removeFeed(this.props.feed)
  }
}

const mapStateToProps = (state, props) => ({
  // state...
})

export default connect(mapStateToProps, {
  removeFeed,
  markAllItemsViewed,
})(FeedDetailMenu)