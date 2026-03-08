import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { rollback, selectors as checkpointSelectors } from '../redux/checkpoint'
import type { RootState } from '../redux/types'

type OwnProps = {
  hideToast: () => void
}

const mapStateToProps = (state: RootState) => ({
  hasCheckpoint: checkpointSelectors.hasCheckpoint(state),
  checkpointName: checkpointSelectors.getCheckpointName(state),
})

const connector = connect(mapStateToProps, {
  rollback,
})

class UndoToast extends React.Component<OwnProps & ConnectedProps<typeof connector>> {
  componentDidUpdate() {
    if (!this.props.hasCheckpoint) {
      this.props.hideToast()
    }
  }

  render() {
    const { rollback, checkpointName } = this.props

    return (
      <div className="Toast-message">
        { checkpointName }:
        <a className="Toast-action" onClick={ () => rollback() }>
          Undo
        </a>
      </div>
    )
  }
}

export default connector(UndoToast)
