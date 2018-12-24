import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import FeedTree from '../containers/FeedTree'
import FeedDetail from '../components/FeedDetail'
import FeedTreeToolbar from '../containers/FeedTreeToolbar'
import FolderToolbar from '../containers/FolderToolbar'
import FeedDetailToolbar from '../containers/FeedDetailToolbar'
import ErrorBoundary from '../components/ErrorBoundary'

import ui from '../redux/modules/ui'
import { openModalLeftAlignedBelow } from '../redux/modules/modal'
import { MODALS } from '../modals'

class App extends React.Component {

  static propTypes = {
    nodes: PropTypes.array.isRequired,
    currentFeed: PropTypes.object,
    currentFolder: PropTypes.object,
    currentViewName: PropTypes.string.isRequired,
    openModalLeftAlignedBelow: PropTypes.func.isRequired
  }

  render() {
    const {nodes, currentFeed, currentFolder} = this.props
    const currentItem = this.currentItem()

    return (
      <ErrorBoundary message="An error ocurred while running Brook.">
        <div className="layout-vertical">
          <div className="Panel-header">
            <span className="isActionable" onClick={ this.handleViewMenu }>
              {this.props.currentViewName}
            </span>
            <FeedTreeToolbar />
          </div>
          <div className="Panel-body layout-2of3">
            <ErrorBoundary message="An error ocurred while displaying your feeds.">
              <FeedTree nodes={nodes} />
            </ErrorBoundary>
          </div>
        
          <div className="Panel-header">
            <span>
              {currentItem ? currentItem.title : "Articles"}
            </span>
              {
                currentFeed 
                ? <FeedDetailToolbar feed={currentFeed} />
                : currentFolder
                ? <FolderToolbar folder={currentFolder} />
                : ""
              }
          </div>
          <div className="Panel-body layout-1of3">
            <ErrorBoundary message="An error ocurred while displaying this feed.">
              <FeedDetail feed={currentFeed} />
            </ErrorBoundary>
          </div>
        </div>
      </ErrorBoundary>
    )
  }

  handleViewMenu = (event) => {
    const el = event.target
    const modalName = MODALS.TreeViewMenu
    this.props.openModalLeftAlignedBelow(el, modalName)
  }

  currentItem() {
    return this.props.currentFeed || this.props.currentFolder
  }
}

const mapStateToProps = (state) => ({
  nodes: ui.selectors.currentNodeList(state),
  currentFeed: ui.selectors.currentFeed(state),
  currentFolder: ui.selectors.currentFolder(state),
  currentViewName: ui.selectors.currentViewName(state),
})

export default connect(mapStateToProps, {
  openModalLeftAlignedBelow
})(App)