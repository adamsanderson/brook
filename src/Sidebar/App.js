import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import FeedList from '../components/FeedList'
import ItemList from '../components/ItemList'

import { addFeed } from '../redux/modules/feeds'
import feedCollection from '../redux/modules/feedCollection'
import ui, { selectFeed } from '../redux/modules/ui'
import views from '../redux/modules/views'

class App extends React.Component {
  render() {
    const {feeds, addFeed, selectFeed, currentItems, isFeedUnread} = this.props
    
    return (
      <div className="layout-vertical">
        <p className="Panel-header">
          <span>Feeds</span>
          <a onClick={ () => addFeed({url: prompt("Feed URL:")}) }>(+)</a>
        </p>
        <div className="Panel-body layout-2of3">
          <FeedList feeds={feeds} onClickFeed={selectFeed} isFeedUnread={isFeedUnread} />
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
  feeds: feedCollection.selectors.all(state),
  currentFeed: ui.selectors.currentFeed(state),
  currentItems: ui.selectors.currentItems(state),
  isFeedUnread: views.selectors.isFeedUnread(state),
})

export default connect(mapStateToProps, {
  addFeed,
  selectFeed,
})(App)