import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import { closeModal } from '../redux/modules/modal'
import { addFolder } from '../redux/modules/folders'
import { importSample } from '../redux/modules/import'

class FeedTreeMenu extends Component {
  constructor(props) {
    super(props)

    this.handleAddFolder = this.handleAddFolder.bind(this)
    this.handleImport = this.handleImport.bind(this)
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
            <a onClick={ this.handleAddFolder }>Add Folder</a>
          </div>
          <div>
            <a onClick={ this.handleImport }>Import Feeds</a>
          </div>
        </div>
      </div>
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
  closeModal,
  addFolder,
  importSample,
})(FeedTreeMenu)