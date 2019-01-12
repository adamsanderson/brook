import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ui from '../redux/modules/ui'

import FeedPanel from '../containers/FeedPanel'
import ItemPanel from '../containers/ItemPanel'
import FeedNavBar from '../containers/FeedNavBar'

class SinglePaneLayout extends React.Component {
  static propTypes = {
    currentFeed: PropTypes.object
  }

  render() {
    const {currentFeed} = this.props

    return (
      <div className="layout-vertical">
        { currentFeed ? this.renderItems(currentFeed) : this.renderFeeds() }
      </div>
    )
  }

  renderItems(feed) {
    return (
      <React.Fragment>
        <ItemPanel feed={feed} />
        <FeedNavBar feed={feed} />
      </React.Fragment>
    )
  }

  renderFeeds() {
    return <FeedPanel />
  }
}

const mapStateToProps = (state) => ({
  currentFeed: ui.selectors.currentFeed(state)
})

export default connect(mapStateToProps, {
  // 
})(SinglePaneLayout)