import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'

import { addFolder } from '../redux/modules/folders'
import { openModal } from '../redux/modules/modal'
import { rollback, selectors as checkpointSelectors } from "../redux/checkpoint";

import { MODALS } from "./index";
import PopupLayout from "./layouts/PopupLayout";

class FeedTreeMenu extends Component {
  constructor(props) {
    super(props)

    this.handleAddFolder = this.handleAddFolder.bind(this)
    this.handleImport = this.handleImport.bind(this)
  }

  render() {    
    const { position, closeModal, hasCheckpoint, checkpointName } = this.props
    
    return (
      <PopupLayout position={position} onClose={closeModal}>
        <div>
          <a onClick={ this.handleAddFolder }>Add Folder</a>
        </div>
        <div>
          <a onClick={ this.handleImport }>Import Feeds</a>
        </div>
        {hasCheckpoint && <div>
          <a onClick={ this.props.rollback }>Undo {checkpointName}</a>
        </div>}
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
  hasCheckpoint: checkpointSelectors.hasCheckpoint(state),
  checkpointName: checkpointSelectors.getCheckpointName(state),
})

export default connect(mapStateToProps, {
  addFolder,
  openModal,
  rollback,
})(FeedTreeMenu)