import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import FeedList from '../components/FeedList'
import ItemList from '../components/ItemList'

import { addFeed } from '../redux/modules/feeds'
import feedCollection from '../redux/modules/feedCollection'
import ui, { selectFeed } from '../redux/modules/ui'

class App extends React.Component {
  render() {
    const {feeds, addFeed, selectFeed, currentItems} = this.props
    
    return (
      <div>
        <div>
          <h1>Feeds</h1>
          <a onClick={ () => addFeed({url: prompt("Feed URL:")}) }>+ Add</a>
          <FeedList feeds={feeds} onClickFeed={selectFeed} />
        </div>
        <div>
          <h2>Articles</h2>
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
})

export default connect(mapStateToProps, {
  addFeed,
  selectFeed,
})(App)