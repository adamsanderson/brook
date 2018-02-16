import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { addFolder } from '../redux/modules/folders'
import { openModal } from '../redux/modules/modal'

import { MODALS } from "./index"
import PopupLayout from "./layouts/PopupLayout"

class FeedTreeMenu extends React.Component {
  
  static propTypes = {
    position: PropTypes.object.isRequired, 
    closeModal: PropTypes.func.isRequired, 
    openModal: PropTypes.func.isRequired, 
    addFolder: PropTypes.func.isRequired, 
  }

  constructor(props) {
    super(props)

    this.handleAddFolder = this.handleAddFolder.bind(this)
    this.handleImport = this.handleImport.bind(this)
  }

  render() {    
    const { position, closeModal } = this.props
    
    return (
      <PopupLayout position={position} onClose={closeModal}>
        <div>
          <a onClick={ this.handleAddFolder }>Add Folder</a>
        </div>
        <div>
          <a onClick={ this.handleImport }>Import Feeds</a>
        </div>
      </PopupLayout>
    )
  }

  handleAddFolder() {
    this.props.closeModal()

    const newFolder = {
      title: "New Folder", 
      isEditing: true
    }
    this.props.addFolder(newFolder)
  }

  handleImport() {
    this.props.openModal(MODALS.ImportModal)
  }

}

const mapStateToProps = (state, props) => ({
  // state
})

export default connect(mapStateToProps, {
  addFolder,
  openModal,
})(FeedTreeMenu)