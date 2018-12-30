import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ItemPanel from './ItemPanel'
import FolderPanel from './FolderPanel'

import ui from '../redux/modules/ui'

class NodePanel extends React.Component {

  static propTypes = {
    currentFeed: PropTypes.object,
    currentFolder: PropTypes.object,
  }

  render() {
    const {currentFeed, currentFolder} = this.props

    if (currentFeed) {
      return <ItemPanel feed={currentFeed} />
    } else if (currentFolder) {
      return <FolderPanel folder={currentFolder} />
    } else {
      return (
        <div className="Panel">
          <div className="Panel-header">
            Articles
          </div>
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  currentFeed: ui.selectors.currentFeed(state),
  currentFolder: ui.selectors.currentFolder(state),
})

export default connect(mapStateToProps, {
  //
})(NodePanel)