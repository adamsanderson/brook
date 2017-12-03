import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'

import { addFeed, fetchAll } from '../redux/modules/feeds'
import { importSample } from '../redux/modules/import'
import { openModal } from '../redux/modules/modal'
import discovery from '../redux/modules/discovery'
import activeTab from '../redux/modules/activeTab'

class SubscribeButton extends Component {

  constructor(props) {
    super(props)

    this.handleNewSubscription = this.handleNewSubscription.bind(this)
  }

  render() {
    const {availableFeeds} = this.props
    const hasFeeds = availableFeeds.length > 0

    return (
      <span>
        {hasFeeds && (
          <a title="Subscribe to Feed" onClick={this.handleNewSubscription} className="is-active">
            Subscribe:{availableFeeds.length}
          </a>
        )}
        <a title="Refresh Feeds" onClick={ fetchAll }>(R)</a>
        <a title="Import Sample Data" onClick={ importSample }>(I)</a>
      </span>
    )
  }

  handleNewSubscription() {
    const feeds = this.props.availableFeeds

    if (!feeds.length) {
      return
    } else if (feeds.length === 1) {
      this.props.addFeed(feeds[0])
    } else {
      this.props.openModal("SubscribeMenu", {feeds});
    }
  }
}

const mapStateToProps = (state, props) => ({
  availableFeeds: discovery.selectors.availableFeeds(state, activeTab.selectors.getActiveTabId(state))
})

export default connect(mapStateToProps, {
  addFeed,
  fetchAll,
  importSample,
  openModal,
})(SubscribeButton)