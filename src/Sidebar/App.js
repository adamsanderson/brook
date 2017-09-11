import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import FeedList from '../components/FeedList'
import { addFeed, fetchFeed } from '../redux/modules/feeds'
import feedCollection from '../redux/modules/feedCollection'

class App extends React.Component {
  render() {
    const {feeds, addFeed, fetchFeed} = this.props
    
    return (
      <div>
        <div>
          <h1>Feeds</h1>
          <a onClick={ () => addFeed({url: prompt("Feed URL:")}) }>+ Add</a>
          <FeedList feeds={feeds} onClickFeed={fetchFeed} />
        </div>
        <div>
          <h2>Articles</h2>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  feeds: feedCollection.selectors.all(state)
})

export default connect(mapStateToProps, {
  addFeed,
  fetchFeed,
})(App)