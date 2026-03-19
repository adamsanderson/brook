import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { editFolder, removeBranch } from '../redux/modules/folders'
import type { Folder } from '../redux/types'
import PopupLayout from './layouts/PopupLayout'

type OwnProps = {
  folder: Folder
  position: React.CSSProperties
  closeModal: () => void
}

const connector = connect(null, {
  editFolder,
  removeBranch,
})

class FolderMenu extends React.Component<OwnProps & ConnectedProps<typeof connector>> {

  render() {
    const { position, closeModal } = this.props

    return (
      <PopupLayout position={position} onClose={closeModal}>
        <div>
          <a onClick={ this.handleEdit }>Rename Folder</a>
        </div>
        <div>
          <a onClick={ this.handleRemove }>Delete Folder</a>
        </div>
      </PopupLayout>
    )
  }

  handleEdit = () => {
    this.handleClose()

    this.props.editFolder(this.props.folder)
  }

  handleRemove = () => {
    this.handleClose()

    this.props.removeBranch(this.props.folder)
  }

  handleClose = () => {
    this.props.closeModal()
  }
}

export default connector(FolderMenu)
