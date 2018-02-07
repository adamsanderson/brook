// todo: component that accepts an action name and callback
import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'

import { rollback, selectors as checkpointSelectors } from '../redux/checkpoint'

class UndoToast extends Component {

  componentWillReceiveProps(nextProps) {
    if (!nextProps.hasCheckpoint) {
      nextProps.hideToast()
    }
  }

  render() {
    const { rollback, checkpointName } = this.props

    return (
      <div className="Toast-message">
        { checkpointName }:
        <a className="Toast-action" onClick={ rollback }>
          Undo
        </a>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  hasCheckpoint: checkpointSelectors.hasCheckpoint(state),
  checkpointName: checkpointSelectors.getCheckpointName(state),
})

export default connect(mapStateToProps, {
  rollback,
})(UndoToast)