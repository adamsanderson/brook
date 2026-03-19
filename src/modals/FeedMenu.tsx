import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { editFeed, removeFeed } from '../redux/modules/feeds'
import type { Feed } from '../redux/types'
import PopupLayout from './layouts/PopupLayout'

type OwnProps = {
  feed: Feed
  position: React.CSSProperties
  closeModal: () => void
}

const connector = connect(null, {
  editFeed,
  removeFeed,
})

class FeedMenu extends React.Component<OwnProps & ConnectedProps<typeof connector>> {
  render() {
    const { position, closeModal } = this.props

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

  handleEdit = () => {
    this.handleClose()

    this.props.editFeed(this.props.feed)
  }

  handleRemove = () => {
    this.handleClose()

    this.props.removeFeed(this.props.feed)
  }

  handleClose = () => {
    this.props.closeModal()
  }
}

export default connector(FeedMenu)
