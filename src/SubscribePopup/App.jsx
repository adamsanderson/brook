import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ErrorBoundary from '../components/ErrorBoundary'
import SubscribeList from '../components/SubscribeList'
import { addFeed } from '../redux/modules/feeds'
import discovery from '../redux/modules/discovery'
import activeTab from '../redux/modules/activeTab'

class App extends React.Component {
  static propTypes = {
    feeds: PropTypes.array.isRequired,
    addFeed: PropTypes.func.isRequired,
  }

  render() {
    return (
      <div className="FullPageLayout layout-vertical">
        <p className="Panel-header">
          Brook
        </p>
        
        <div className="Panel-body">
          <ErrorBoundary message="An error occurred while running Brook.">
            <p>Subscribe to:</p>
            <SubscribeList feeds={this.props.feeds} onSubscribe={this.handleSubscription} />
          </ErrorBoundary>
        </div>
      </div>
    )
  }

  handleSubscription = (feed) => {
    this.props.addFeed(feed, {fetch: true})
    browser.sidebarAction.open()
    window.close()
  }
}

const mapStateToProps = (state, props) => ({
  feeds: discovery.selectors.unsubscribedFeeds(state, activeTab.selectors.getActiveTabId(state)),
})

export default connect(mapStateToProps, {
  addFeed,
})(App)