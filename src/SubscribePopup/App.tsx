import React from 'react'
import browser from 'webextension-polyfill'
import { connect, ConnectedProps } from 'react-redux'

import ErrorBoundary from '../components/ErrorBoundary'
import SubscribeList from '../components/SubscribeList'
import { addFeed } from '../redux/modules/feeds'
import discovery from '../redux/modules/discovery'
import activeTab from '../redux/modules/activeTab'
import type { Feed, RootState } from '../redux/types'

const mapStateToProps = (state: RootState) => ({
  feeds: discovery.selectors.unsubscribedFeeds(state, activeTab.selectors.getActiveTabId(state) ?? -1) as Feed[],
})

const connector = connect(mapStateToProps, {
  addFeed,
})

class App extends React.Component<ConnectedProps<typeof connector>> {
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

  handleSubscription = (feed: Feed) => {
    this.props.addFeed(feed, { fetch: true })
    void browser.sidebarAction.open().catch((error) => {
      console.warn('Could not open sidebar', error)
    })
    window.close()
  }
}

export default connector(App)
