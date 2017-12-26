import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'

import { closeModal } from '../../redux/modules/modal'
import BackIcon from 'react-icons/lib/fa/chevron-left'

class FullPageLayout extends Component {

  static defaultProps = {
    backMessage: "Back to Feeds"
  }

  render() {
    const {closeModal, backMessage, children, ...rest} = this.props

    return (
      <div className="Modal FullPageLayout inverted layout-vertical">
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
})(FullPageLayout)