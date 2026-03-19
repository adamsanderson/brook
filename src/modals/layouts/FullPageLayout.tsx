import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { closeModal } from '../../redux/modules/modal'
import { ArrowLeft as BackIcon } from 'react-feather'

type OwnProps = {
  backMessage?: string
  children: React.ReactNode
}

const connector = connect(null, {
  closeModal,
})

class FullPageLayout extends React.Component<OwnProps & ConnectedProps<typeof connector>> {
  render() {
    const { closeModal, children } = this.props
    const backMessage = this.props.backMessage ?? "Back to Feeds"

    return (
      <div className="Modal FullPageLayout inverted layout-vertical">
        <p className="Panel-header">
          <a onClick={ () => closeModal() }>
            <BackIcon className="Icon"/>
            {" " + backMessage}
          </a>
        </p>

        <div className="Panel-body">
          { children }
        </div>
      </div>
    )
  }
}

export default connector(FullPageLayout)
