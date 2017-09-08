import React from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'

import FeedList from '../components/FeedList'
import {addFeed} from '../redux/modules/feeds'

class App extends React.Component {
  render() {
    const {feeds, addFeed} = this.props
    
    return (
      <div>
        <div>
          <h1>Feeds</h1>
          <a onClick={ () => addFeed({url: prompt("Feed URL:")}) }>+ Add</a>
          <FeedList feeds={feeds} />
        </div>
        <div>
          <h2>Articles</h2>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  feeds: state.feeds
})

export default connect(mapStateToProps, {
  addFeed
})(App)