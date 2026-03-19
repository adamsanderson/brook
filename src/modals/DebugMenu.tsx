import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { resetData } from '../redux/reset'

import PopupLayout from "./layouts/PopupLayout"

type OwnProps = {
  position: React.CSSProperties
  closeModal: () => void
}

const connector = connect(null, {
  resetData,
})

class DebugMenu extends React.Component<OwnProps & ConnectedProps<typeof connector>> {

  render() {
    const { position, closeModal } = this.props

    return (
      <PopupLayout position={position} onClose={closeModal}>
        <h4>Debug Menu</h4>
        <div>
          <a href="#">Open in Browser</a>
        </div>
        <hr/>
        <div className="isWarning">
          <a onClick={ this.handleReset }>Reset Data</a>
        </div>

      </PopupLayout>
    )
  }

  handleReset = () => {
    this.props.resetData()
  }
}

export default connector(DebugMenu)
