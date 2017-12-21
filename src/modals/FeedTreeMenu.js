import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'

import { addFolder } from '../redux/modules/folders'
import { importSample } from '../redux/modules/import'
import PopupLayout from "./layouts/PopupLayout";

class FeedTreeMenu extends Component {
  constructor(props) {
    super(props)

    this.handleAddFolder = this.handleAddFolder.bind(this)
    this.handleImport = this.handleImport.bind(this)
  }

  render() {    
    const { importSample, position, closeModal } = this.props
    
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
    this.handleClose()

    const newFolder = {
      title: "New Folder", 
      isEditing: true
    }
    this.props.addFolder(newFolder)
  }

  handleImport() {
    this.handleClose()

    this.props.importSample()
  }

  handleClose() {
    this.props.closeModal()
  }
}

const mapStateToProps = (state, props) => ({
  // state...
})

export default connect(mapStateToProps, {
  addFolder,
  importSample,
})(FeedTreeMenu)