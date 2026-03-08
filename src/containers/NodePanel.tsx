import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import ItemPanel from './ItemPanel'
import FolderPanel from './FolderPanel'

import ui from '../redux/modules/ui'
import type { RootState } from '../redux/types'

const mapStateToProps = (state: RootState) => ({
  currentFeed: ui.selectors.currentFeed(state),
  currentFolder: ui.selectors.currentFolder(state),
})

const connector = connect(mapStateToProps)

class NodePanel extends React.Component<ConnectedProps<typeof connector>> {
  render() {
    const { currentFeed, currentFolder } = this.props

    if (currentFeed) {
      return <ItemPanel feed={currentFeed} />
    }

    if (currentFolder) {
      return <FolderPanel folder={currentFolder} />
    }

    return (
      <div className="Panel">
        <div className="Panel-header">
          Articles
        </div>
      </div>
    )
  }
}

export default connector(NodePanel)
