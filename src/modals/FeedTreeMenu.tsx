import React from 'react'
import browser from 'webextension-polyfill'
import { connect, ConnectedProps } from 'react-redux'

import { addFolder } from '../redux/modules/folders'
import { exportOpml } from '../redux/modules/export'
import { openModal } from '../redux/modules/modal'
import type { FolderInput } from '../redux/types'

import PopupLayout from "./layouts/PopupLayout"
import { MODALS } from '../modals/index'

type OwnProps = {
  position: React.CSSProperties
  closeModal: () => void
}

const connector = connect(null, {
  addFolder,
  openModal,
  exportOpml,
})

class FeedTreeMenu extends React.Component<OwnProps & ConnectedProps<typeof connector>> {

  render() {
    const { position, closeModal } = this.props

    return (
      <PopupLayout position={position} onClose={closeModal}>
        <div>
          <a onClick={ this.handleAddFolder }>Add Folder</a>
        </div>
        <div>
          <a onClick={ this.handleAddFeedByUrl }>Add Feed By URL</a>
        </div>
        <div>
          <a href={ browser.runtime.getURL('src/Import/index.html') }>Import Feeds</a>
        </div>
        <div>
          <a onClick={ this.handleExport }>Export Feeds</a>
        </div>
        <hr/>
        <div>
          <a onClick={ this.handleOptions }>Options</a>
        </div>
      </PopupLayout>
    )
  }

  handleAddFolder = () => {
    this.props.closeModal()

    const newFolder: FolderInput = {
      title: "New Folder",
      isEditing: true
    }
    this.props.addFolder(newFolder)
  }

  handleAddFeedByUrl = () => {
    this.props.openModal(MODALS.AddByUrlMenu)
  }

  handleExport = () => {
    this.props.exportOpml()
  }

  handleOptions = () => {
    browser.runtime.openOptionsPage().catch((error) => {
      console.warn('Could not open options page', error)
    })
  }
}

export default connector(FeedTreeMenu)
