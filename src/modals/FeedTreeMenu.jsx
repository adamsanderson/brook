import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { addFolder } from '../redux/modules/folders'
import { exportOpml } from '../redux/modules/export'
import { openModal } from '../redux/modules/modal'

import PopupLayout from "./layouts/PopupLayout"
import { MODALS } from '../modals/index'

class FeedTreeMenu extends React.Component {

  static propTypes = {
    position: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    addFolder: PropTypes.func.isRequired,
    exportOpml: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { position, closeModal } = this.props

    return (
      <PopupLayout position={position} onClose={closeModal}>
        <div>
          <a onClick={ this.handleAddFolder }>Add Folder</a>
        </div>
        <div>
          <a onClick={ this.handleAddFeedByUrl }>Add Feed By URL</a>
        </div>
        <div>
          <a href={ browser.runtime.getURL('src/Import/index.html') }>Import Feeds</a>
        </div>
        <div>
          <a onClick={ this.handleExport }>Export Feeds</a>
        </div>
        <hr/>
        <div>
          <a onClick={ this.handleOptions }>Options</a>
        </div>
      </PopupLayout>
    )
  }

  handleAddFolder = () => {
    this.props.closeModal()

    const newFolder = {
      title: "New Folder",
      isEditing: true
    }
    this.props.addFolder(newFolder)
  }

  handleAddFeedByUrl = () => {
    this.props.openModal(MODALS.AddByUrlMenu)
  }

  handleExport = () => {
    this.props.exportOpml()
  }

  handleOptions() {
    browser.runtime.openOptionsPage()
  }
}

const mapStateToProps = (state, props) => ({
  // state
})

export default connect(mapStateToProps, {
  addFolder,
  openModal,
  exportOpml,
})(FeedTreeMenu)