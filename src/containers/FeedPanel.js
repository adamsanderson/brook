import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import FeedTree from '../containers/FeedTree'
import FeedTreeToolbar from '../containers/FeedTreeToolbar'
import ErrorBoundary from '../components/ErrorBoundary'

import ui from '../redux/modules/ui'

class FeedPanel extends React.Component {

  static propTypes = {
    nodes: PropTypes.array.isRequired,
  }

  render() {
    const {nodes} = this.props
    
    return (
      <ErrorBoundary message="An error ocurred while displaying your feeds.">
        <div className="Panel">
          <FeedTreeToolbar />
          <div className="Panel-body">
            <FeedTree nodes={nodes} />
          </div>
        </div>
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = (state) => ({
  nodes: ui.selectors.currentNodeList(state),
})

export default connect(mapStateToProps, {
})(FeedPanel)