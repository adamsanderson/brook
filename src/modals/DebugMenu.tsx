import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { resetData } from '../redux/reset'
import { addFeed } from '../redux/modules/feeds'

import PopupLayout from "./layouts/PopupLayout"
import { WATCH_PAGE } from '@/constants'
import Browser from 'webextension-polyfill'

type OwnProps = {
  position: React.CSSProperties
  closeModal: () => void
}

const connector = connect(null, {
  resetData,
  addFeed
})

class DebugMenu extends React.Component<OwnProps & ConnectedProps<typeof connector>> {

  render() {
    const { position, closeModal } = this.props

    return (
      <PopupLayout position={position} onClose={closeModal}>
        <h4>Debug Menu</h4>
        <div>
          <a onClick={ () => void this.handleWatchPage() }>Watch Page</a>
        </div>
        <hr />
        <div className="isWarning">
          <a onClick={ this.handleReset }>Reset Data</a>
        </div>

      </PopupLayout>
    )
  }

  handleReset = () => {
    this.props.resetData()
  }

  handleWatchPage = async () => {
    const tab = (await Browser.tabs.query({active: true, currentWindow: true}))[0]
    if (!tab.url) return

    this.props.addFeed({
      url: tab.url,
      title: tab.title,
      format: WATCH_PAGE,
    })
  }
}

export default connector(DebugMenu)
