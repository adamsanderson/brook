import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import FeedTree from '../containers/FeedTree'
import FeedDetail from '../components/FeedDetail'
import FeedTreeToolbar from '../containers/FeedTreeToolbar'
import FolderToolbar from '../containers/FolderToolbar'
import FeedDetailToolbar from '../containers/FeedDetailToolbar'

import folders from '../redux/modules/folders'
import ui from '../redux/modules/ui'

class App extends React.Component {

  static propTypes = {
    nodes: PropTypes.array.isRequired,
    currentFeed: PropTypes.object,
    currentFolder: PropTypes.object,
  }

  render() {
    const {nodes, currentFeed, currentFolder} = this.props
    const currentItem = this.currentItem()

    return (
      <div className="layout-vertical">
        <p className="Panel-header">
          <span>Feeds</span>
          <FeedTreeToolbar />
        </p>
        <div className="Panel-body layout-2of3">
          <FeedTree nodes={nodes} />
        </div>
      
        <p className="Panel-header">
          <span>
            {currentItem ? currentItem.title : "Articles"}
          </span>
            {
              currentFeed 
              ? <FeedDetailToolbar feed={currentFeed} />
              : currentFolder
              ? <FolderToolbar folder={currentFolder} />
              : ""
            }
        </p>
        <div className="Panel-body layout-1of3">
          <FeedDetail feed={currentFeed} />
        </div>
      </div>
    )
  }

  currentItem() {
    return this.props.currentFeed || this.props.currentFolder
  }
}

const mapStateToProps = (state) => ({
  nodes: folders.selectors.getNodeList(state),
  currentFeed: ui.selectors.currentFeed(state),
  currentFolder: ui.selectors.currentFolder(state),
})

export default connect(mapStateToProps, {
  // Actions
})(App)