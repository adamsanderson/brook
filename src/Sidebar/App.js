import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import FeedList from '../components/FeedList'
import ItemList from '../components/ItemList'

import { addFeed, fetchAll } from '../redux/modules/feeds'
import feedCollection from '../redux/modules/feedCollection'
import ui, { selectFeed, selectItem } from '../redux/modules/ui'
import views from '../redux/modules/views'

class App extends React.Component {
  render() {
    const {feeds, addFeed, fetchAll, selectFeed, selectItem, currentItems, isFeedUnread, isItemUnread} = this.props
    
    return (
      <div className="layout-vertical">
        <p className="Panel-header">
          <span>Feeds</span>
          <a onClick={ fetchAll }>(R)</a>
          <a onClick={ () => addFeed({url: prompt("Feed URL:")}) }>(+)</a>
        </p>
        <div className="Panel-body layout-2of3">
          <FeedList feeds={feeds} onClickFeed={selectFeed} isFeedUnread={isFeedUnread} />
        </div>
      
        <p className="Panel-header">Articles</p>
        <div className="Panel-body layout-1of3">
          <ItemList items={currentItems} onClickItem={selectItem} isItemUnread={isItemUnread} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  feeds: feedCollection.selectors.all(state),
  currentFeed: ui.selectors.currentFeed(state),
  currentItems: ui.selectors.currentItems(state),
  isFeedUnread: views.selectors.isFeedUnread(state),
  isItemUnread: views.selectors.isItemUnread(state),
})

export default connect(mapStateToProps, {
  addFeed,
  fetchAll,
  selectFeed,
  selectItem,
})(App)