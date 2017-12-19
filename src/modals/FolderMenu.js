import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import { closeModal } from '../redux/modules/modal'
import { editFolder, removeBranch } from '../redux/modules/folders'

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
    const {targetRegion, importSample} = this.props
    const position = {
      top: targetRegion.bottom + 5, 
      right: document.body.clientWidth - targetRegion.right,
    }
    
    return (
      <div className="Modal" onClick={ this.props.closeModal }>
        <div className="Menu" style={position}>
          <div>
            <a onClick={ this.handleEdit }>Rename Folder</a>
          </div>
          <div>
            <a onClick={ this.handleRemove }>Delete Folder</a>
          </div>
        </div>
      </div>
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
  closeModal,
  editFolder,
  removeBranch,
})(FolderMenu)