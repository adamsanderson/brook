import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import FeedTree from '../containers/FeedTree'
import FeedDetail from '../components/FeedDetail'
import FeedTreeToolbar from '../containers/FeedTreeToolbar'

import { removeFeed } from '../redux/modules/feeds'
import folders, { removeBranch } from '../redux/modules/folders'
import ui from '../redux/modules/ui'
import activeTab from '../redux/modules/activeTab'
import discovery from '../redux/modules/discovery'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.handleRemove = this.handleRemove.bind(this)
  }

  render() {
    const {nodes, addFeed, fetchAll, importSample, currentFeed, currentFolder} = this.props
    const currentItem = this.currentItem();

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
            { currentItem && (
              <a title="Remove" onClick={ this.handleRemove }>(x)</a>
            )}
        </p>
        <div className="Panel-body layout-1of3">
          <FeedDetail feed={currentFeed} />
        </div>
      </div>
    )
  }

  handleRemove() {
    if (this.props.currentFeed) {
      this.props.removeFeed(this.props.currentFeed)
    } else if (this.props.currentFolder) {
      this.props.removeBranch(this.props.currentFolder)
    }
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
  removeFeed,
  removeBranch,
})(App)