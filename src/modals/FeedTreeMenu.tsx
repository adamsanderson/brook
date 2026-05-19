import React from 'react'
import browser from 'webextension-polyfill'
import { connect, ConnectedProps } from 'react-redux'

import { addFolder } from '../redux/modules/folders'
import { exportOpml } from '../redux/modules/export'
import { openModal } from '../redux/modules/modal'
import type { FolderInput, RootState } from '../redux/types'

import PopupLayout from "./layouts/PopupLayout"
import { MODALS } from '../modals/index'
import activeTab from '../redux/modules/activeTab'
import feeds, { addFeed } from '@/redux/modules/feeds'
import { humanizeURL } from '@/util/url'
import { WATCH_PAGE } from '@/constants'

type OwnProps = {
  position: React.CSSProperties
  closeModal: () => void
}

const mapStateToProps = (state: RootState) => {
  const activeUrl = activeTab.selectors.getActiveUrl(state)
  const canWatchPage = activeUrl && !feeds.selectors.getFeedByUrl(state, activeUrl)
  return {
    activeUrl,
    canWatchPage
  }
}

const connector = connect(mapStateToProps, {
  addFolder,
  addFeed,
  openModal,
  exportOpml,
})

class FeedTreeMenu extends React.Component<OwnProps & ConnectedProps<typeof connector>> {

  render() {
    const { position, closeModal } = this.props

    return (
      <PopupLayout position={position} onClose={closeModal}>
        <div>
          <a onClick={this.handleAddFolder}>Add Folder</a>
        </div>
        <div>
          <a onClick={this.handleAddFeedByUrl}>Add Feed By URL</a>
        </div>
        <div>
          <a className={this.props.canWatchPage ? '' : 'disabled'} onClick={this.handleWatchPage}>Watch Page</a>
        </div>
        <div>
          <a href={browser.runtime.getURL('src/Import/index.html')}>Import Feeds</a>
        </div>
        <div>
          <a onClick={this.handleExport}>Export Feeds</a>
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

  handleWatchPage = () => {
    if (!this.props.canWatchPage || !this.props.activeUrl) return

    this.props.addFeed({
      url: this.props.activeUrl,
      title: humanizeURL(this.props.activeUrl),
      format: WATCH_PAGE,
    })
  }

  handleExport = () => {
    this.props.exportOpml()
  }

}

export default connector(FeedTreeMenu)
