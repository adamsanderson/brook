import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import FeedTree from '../containers/FeedTree'
import FeedDetail from '../components/FeedDetail'

import { addFeed, fetchAll } from '../redux/modules/feeds'
import { importSample } from '../redux/modules/import'
import folders from '../redux/modules/folders'
import ui from '../redux/modules/ui'

class App extends React.Component {
  render() {
    const {nodes, addFeed, fetchAll, importSample, currentFeed} = this.props
    
    return (
      <div className="layout-vertical">
        <p className="Panel-header">
          <span>Feeds</span>
          <a title="Refresh Feeds" onClick={ fetchAll }>(R)</a>
          <a title="Import Sample Data" onClick={ importSample }>(I)</a>
          <a title="Add feed" onClick={ () => addFeed({url: prompt("Feed URL:")}) }>(+)</a>
        </p>
        <div className="Panel-body layout-2of3">
          <FeedTree nodes={nodes} />
        </div>
      
        <p className="Panel-header">
          <span>
            {currentFeed ? currentFeed.title : "Articles"}
          </span>
        </p>
        <div className="Panel-body layout-1of3">
          <FeedDetail feed={currentFeed} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  nodes: folders.selectors.getNodeList(state),
  currentFeed: ui.selectors.currentFeed(state),
})

export default connect(mapStateToProps, {
  addFeed,
  fetchAll,
  importSample,
})(App)