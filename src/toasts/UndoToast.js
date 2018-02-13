// todo: component that accepts an action name and callback
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { rollback, selectors as checkpointSelectors } from '../redux/checkpoint'

class UndoToast extends React.Component {

  static propTypes = {
    hasCheckpoint: PropTypes.bool,
    checkpointName: PropTypes.string,
    rollback: PropTypes.func.isRequired,
    hideToast: PropTypes.func.isRequired,
  }

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