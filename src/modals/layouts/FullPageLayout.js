import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import { closeModal } from '../../redux/modules/modal'

import BackIcon from 'react-icons/lib/fa/chevron-left'

class SubscribeMenu extends Component {

  static defaultProps = {
    backMessage: "Back to Feeds"
  }

  render() {
    const {closeModal, backMessage, children} = this.props

    return (
      <div className="Modal inverted layout-vertical">
        <p className="Panel-header">
          <a onClick={ closeModal }>
            <BackIcon /> 
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

const mapStateToProps = (state, props) => ({
  // state...
})

export default connect(mapStateToProps, {
  closeModal,
})(SubscribeMenu)