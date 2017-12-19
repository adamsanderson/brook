import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'

import { openModal } from '../redux/modules/modal'
import { MODALS } from '../modals'

import MenuIcon from 'react-icons/lib/fa/ellipsis-v'

class FolderToolbar extends Component {

  static propTypes = {
    folder: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.handleMenu = this.handleMenu.bind(this)
  }

  render() {
    return (
      <span>
        <MenuIcon className="Icon" onClick={ this.handleMenu } />
      </span>
    )
  }

  handleMenu(event) {
    const folder = this.props.folder
    const rect = event.target.getBoundingClientRect()
    const targetRegion = {
      top: rect.top, 
      left: rect.left, 
      bottom: rect.bottom, 
      right: rect.right,
    }
    
    this.props.openModal(MODALS.FolderMenu, {
      targetRegion, 
      folder 
    })
  }
}

const mapStateToProps = (state, props) => ({
  // props
})

export default connect(mapStateToProps, {
  openModal,
})(FolderToolbar)