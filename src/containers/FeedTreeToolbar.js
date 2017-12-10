import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'

import { addFeed, fetchAll } from '../redux/modules/feeds'
import { addFolder } from '../redux/modules/folders'
import { importSample } from '../redux/modules/import'
import { openModal } from '../redux/modules/modal'
import discovery from '../redux/modules/discovery'
import activeTab from '../redux/modules/activeTab'

class FeedTreeToolbar extends Component {

  constructor(props) {
    super(props)

    this.handleNewSubscription = this.handleNewSubscription.bind(this)
    this.handleAddFolder = this.handleAddFolder.bind(this)
  }

  render() {
    const {availableFeeds, fetchAll, importSample} = this.props
    const hasFeeds = availableFeeds.length > 0

    return (
      <span>
        {hasFeeds && (
          <a title="Subscribe to Feed" onClick={this.handleNewSubscription} className="is-active">
            Subscribe{availableFeeds.length > 1 ? "… " : " "}
          </a>
        )}
        <a title="Add Folder" onClick={ this.handleAddFolder }>(F)</a>
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

  handleAddFolder() {
    const newFolder = {
      title: "New Folder", 
      isEditing: true
    }
    this.props.addFolder(newFolder)
  }
}

const mapStateToProps = (state, props) => ({
  availableFeeds: discovery.selectors.availableFeeds(state, activeTab.selectors.getActiveTabId(state))
})

export default connect(mapStateToProps, {
  addFeed,
  addFolder,
  fetchAll,
  importSample,
  openModal,
})(FeedTreeToolbar)