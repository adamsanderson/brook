import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import FeedTree from '../containers/FeedTree'
import ItemList from '../containers/ItemList'

import { addFeed, fetchAll } from '../redux/modules/feeds'
import { importSample } from '../redux/modules/import'
import folders from '../redux/modules/folders'
import ui from '../redux/modules/ui'

class App extends React.Component {
  render() {
    const {nodes, addFeed, fetchAll, importSample, selectItem, currentItems, isFeedUnread, isItemUnread} = this.props
    
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
      
        <p className="Panel-header">Articles</p>
        <div className="Panel-body layout-1of3">
          <ItemList items={currentItems} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  nodes: folders.selectors.getNodeList(state),
  currentItems: ui.selectors.currentItems(state),
})

export default connect(mapStateToProps, {
  addFeed,
  fetchAll,
  importSample,
})(App)