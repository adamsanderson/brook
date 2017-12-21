import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'

import { editFolder, removeBranch } from '../redux/modules/folders'
import PopupLayout from './layouts/PopupLayout'

class FolderMenu extends Component {

  static propTypes = {
    folder: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.handleEdit = this.handleEdit.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
  }

  render() {    
    const {position, closeModal} = this.props
    
    return (
      <PopupLayout position={position} onClose={closeModal}>
        <div>
          <a onClick={ this.handleEdit }>Rename Folder</a>
        </div>
        <div>
          <a onClick={ this.handleRemove }>Delete Folder</a>
        </div>
      </PopupLayout>
    )
  }

  handleEdit() {
    this.handleClose()

    this.props.editFolder(this.props.folder)
  }

  handleRemove() {
    this.handleClose()

    this.props.removeBranch(this.props.folder)
  }

  handleClose() {
    this.props.closeModal()
  }
}

const mapStateToProps = (state, props) => ({
  // state...
})

export default connect(mapStateToProps, {
  editFolder,
  removeBranch,
})(FolderMenu)