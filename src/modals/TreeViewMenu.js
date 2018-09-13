import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { changeView } from '../redux/modules/ui'

import PopupLayout from "./layouts/PopupLayout"

class TreeViewMenu extends React.Component {
  
  static propTypes = {
    position: PropTypes.object.isRequired, 
    closeModal: PropTypes.func.isRequired, 
    changeView: PropTypes.func.isRequired,
  }

  render() {    
    const { position, closeModal } = this.props
    
    return (
      <PopupLayout position={position} onClose={closeModal}>
        <div>
          <a onClick={ this.handleViewAll}> All Feeds </a>
        </div>
        <div>
          <a onClick={ this.handleViewRecent}> Recent Feeds </a>
        </div>
      </PopupLayout>
    )
  }

  handleViewAll = (event) =>  {
    this.props.changeView("all")
  }

  handleViewRecent = (event) =>  {
    this.props.changeView("recent")
  }

}

const mapStateToProps = (state, props) => ({
  // state
})

export default connect(mapStateToProps, {
  changeView,
})(TreeViewMenu)