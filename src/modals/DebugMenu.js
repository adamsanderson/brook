import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { resetData } from '../redux/reset'

import PopupLayout from "./layouts/PopupLayout"
import { addFeed } from '../redux/modules/feeds'

class DebugMenu extends React.Component {
  static propTypes = {
    position: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
    resetData: PropTypes.func.isRequired,
    addFeed: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.handleReset = this.handleReset.bind(this)
    this.handleAddByUrl = this.handleAddByUrl.bind(this)
  }

  render() {    
    const { position, closeModal } = this.props
    
    return (
      <PopupLayout position={position} onClose={closeModal}>
        <h4>Debug Menu</h4>
        <div>
          <a href="#">Open in Browser</a>
        </div>
        <div>
          <a onClick={ this.handleAddByUrl }>Add by URL</a>
        </div>
        <hr/>
        <div className="isWarning">
          <a onClick={ this.handleReset }>Reset Data</a>
        </div>
        
      </PopupLayout>
    )
  }

  handleReset() {
    this.props.resetData()
  }

  handleAddByUrl() {
    const url = prompt("Add feed by url")
    this.props.addFeed({url})
  }
}

const mapStateToProps = (state, props) => ({
  // state...
})

export default connect(mapStateToProps, {
  resetData,
  addFeed,
})(DebugMenu)