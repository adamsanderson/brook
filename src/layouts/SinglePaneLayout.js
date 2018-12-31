import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ui from '../redux/modules/ui'

import FeedPanel from '../containers/FeedPanel'
import ItemPanel from '../containers/ItemPanel'

class SinglePaneLayout extends React.Component {
  static propTypes = {
    currentFeed: PropTypes.object
  }

  render() {
    const {currentFeed} = this.props

    return (
      <div className="layout-vertical">
        {  
          currentFeed ?
            <ItemPanel feed={currentFeed} /> :
            <FeedPanel />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  currentFeed: ui.selectors.currentFeed(state)
})

export default connect(mapStateToProps, {
  // 
})(SinglePaneLayout)