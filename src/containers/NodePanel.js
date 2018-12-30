import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import FeedDetail from '../components/FeedDetail'
import FolderToolbar from '../containers/FolderToolbar'
import FeedDetailToolbar from '../containers/FeedDetailToolbar'
import ErrorBoundary from '../components/ErrorBoundary'

import ui from '../redux/modules/ui'

class NodePanel extends React.Component {

  static propTypes = {
    currentFeed: PropTypes.object,
    currentFolder: PropTypes.object,
  }

  render() {
    const {currentFeed, currentFolder} = this.props

    if (currentFeed) {
      return (
        <ErrorBoundary message="An error ocurred while displaying this feed.">  
          <div className="Panel">
            <FeedDetailToolbar feed={currentFeed} />
            <div className="Panel-body">
              <FeedDetail feed={currentFeed} />
            </div>
          </div>
        </ErrorBoundary>
      )
    } else if (currentFolder) {
      return (
        <ErrorBoundary message="An error ocurred while displaying this folder.">
          <div className="Panel">
            <FolderToolbar folder={currentFolder} />
          </div>
        </ErrorBoundary>
      )
    } else {
      return (
        <div className="Panel">
          <div className="Panel-header">
            Articles
          </div>
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  currentFeed: ui.selectors.currentFeed(state),
  currentFolder: ui.selectors.currentFolder(state),
})

export default connect(mapStateToProps, {
  //
})(NodePanel)