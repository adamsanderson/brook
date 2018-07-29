import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { closeModal } from '../../redux/modules/modal'
import { ArrowLeft as BackIcon } from 'react-feather'

class FullPageLayout extends React.Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired, 
    backMessage: PropTypes.string, 
    children: PropTypes.node.isRequired
  }

  static defaultProps = {
    backMessage: "Back to Feeds"
  }

  render() {
    const {closeModal, backMessage, children} = this.props

    return (
      <div className="Modal FullPageLayout inverted layout-vertical">
        <p className="Panel-header">
          <a onClick={ closeModal }>
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

const mapStateToProps = (state, props) => ({
  // state...
})

export default connect(mapStateToProps, {
  closeModal,
})(FullPageLayout)