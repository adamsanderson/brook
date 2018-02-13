import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { resetData } from '../redux/reset'

import PopupLayout from "./layouts/PopupLayout"

class DebugMenu extends React.Component {
  static propTypes = {
    position: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
    resetData: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.handleReset = this.handleReset.bind(this)
  }

  render() {    
    const { position, closeModal } = this.props
    
    return (
      <PopupLayout position={position} onClose={closeModal}>
        <h4>Debug Menu</h4>
        <div className="isWarning">
          <a href="#">Open in Browser</a>
        </div>
        <div className="isWarning">
          <a onClick={ this.handleReset }>Reset Data</a>
        </div>
      </PopupLayout>
    )
  }

  handleReset() {
    this.props.resetData()
  }
}

const mapStateToProps = (state, props) => ({
  // state...
})

export default connect(mapStateToProps, {
  resetData,
})(DebugMenu)