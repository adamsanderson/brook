import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ErrorBoundary from '../components/ErrorBoundary'
import FeedPanel from '../containers/FeedPanel'
import NodePanel from '../containers/NodePanel'

class App extends React.Component {

  static propTypes = {

  }

  render() {
    
    return (
      <ErrorBoundary message="An error ocurred while running Brook.">
        <div className="layout-vertical">
          <div className="layout-flex-2">
            <FeedPanel />
          </div>
          <div className="layout-flex-1">
            <NodePanel />
          </div>
        </div>
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps, {
  // 
})(App)