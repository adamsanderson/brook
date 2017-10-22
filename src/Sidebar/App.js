import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import FeedTree from '../containers/FeedTree'
import FeedDetail from '../components/FeedDetail'

import { addFeed, removeFeed, fetchAll } from '../redux/modules/feeds'
import { importSample } from '../redux/modules/import'
import folders from '../redux/modules/folders'
import ui from '../redux/modules/ui'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.handleRemoveFeed = this.handleRemoveFeed.bind(this)
  }

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
            { currentFeed && (
              <a title="Remove feed" onClick={ this.handleRemoveFeed }>(x)</a>
            )}
        </p>
        <div className="Panel-body layout-1of3">
          <FeedDetail feed={currentFeed} />
        </div>
      </div>
    )
  }

  handleRemoveFeed() {
    this.props.removeFeed(this.props.currentFeed);
  }
}

const mapStateToProps = (state) => ({
  nodes: folders.selectors.getNodeList(state),
  currentFeed: ui.selectors.currentFeed(state),
})

export default connect(mapStateToProps, {
  addFeed,
  removeFeed,
  fetchAll,
  importSample,
})(App)