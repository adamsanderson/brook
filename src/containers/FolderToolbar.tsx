import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { MoreVertical as MenuIcon } from 'react-feather'

import { openModalRightAlignedBelow } from '../redux/modules/modal'
import { MODALS } from '../modals'
import type { Folder } from '../redux/types'

type OwnProps = {
  folder?: Folder
}

const connector = connect(null, {
  openModalRightAlignedBelow,
})

class FolderToolbar extends React.PureComponent<OwnProps & ConnectedProps<typeof connector>> {
  render() {
    const { folder } = this.props

    return (
      <div className="Panel-header">
        <span>
          {folder?.title || 'Folder'}
        </span>
        <span>
          <MenuIcon className="Icon" onClick={ this.handleMenu } />
        </span>
      </div>
    )
  }

  handleMenu = (event: React.MouseEvent<Element>) => {
    const folder = this.props.folder
    if (!folder) return

    const el = event.currentTarget
    this.props.openModalRightAlignedBelow(el, MODALS.FolderMenu, {
      folder
    })
  }
}

export default connector(FolderToolbar)
