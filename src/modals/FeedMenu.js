import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { editFeed, removeFeed } from '../redux/modules/feeds'
import PopupLayout from './layouts/PopupLayout'

class FeedMenu extends React.Component {

  static propTypes = {
    feed: PropTypes.object.isRequired,
    position: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
    editFeed: PropTypes.func.isRequired,
    removeFeed: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.handleEdit = this.handleEdit.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
  }

  render() {
    const {position, closeModal} = this.props

    return (
      <PopupLayout position={position} onClose={closeModal}>
        <div>
          <a onClick={ this.handleEdit }>Rename Feed</a>
        </div>
        <div>
          <a onClick={ this.handleRemove }>Delete Feed</a>
        </div>
      </PopupLayout>
    )
  }

  handleEdit() {
    this.handleClose()

    this.props.editFeed(this.props.feed)
  }

  handleRemove() {
    this.handleClose()

    this.props.removeFeed(this.props.feed)
  }

  handleClose() {
    this.props.closeModal()
  }
}

const mapStateToProps = (state, props) => ({
  // state...
})

export default connect(mapStateToProps, {
  editFeed,
  removeFeed,
})(FeedMenu)