import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'

import { addFeed, fetchAll } from '../redux/modules/feeds'
import { openModal, openModalRightAlignedBelow } from '../redux/modules/modal'
import discovery from '../redux/modules/discovery'
import activeTab from '../redux/modules/activeTab'

import { MODALS } from '../modals'

import RefreshIcon from 'react-icons/lib/fa/refresh'
import MenuIcon from 'react-icons/lib/fa/ellipsis-v'

class FeedTreeToolbar extends Component {

  constructor(props) {
    super(props)

    this.handleNewSubscription = this.handleNewSubscription.bind(this)
    this.handleMenu = this.handleMenu.bind(this)
  }

  render() {
    const {availableFeeds, fetchAll} = this.props
    const hasFeeds = availableFeeds.length > 0

    return (
      <span>
        {hasFeeds && (
          <a title="Subscribe to Feed" onClick={this.handleNewSubscription} className="isActive">
            Subscribe{availableFeeds.length > 1 ? "… " : " "}
          </a>
        )}
        <RefreshIcon className="Icon" title="Refresh Feeds" onClick={ fetchAll } />
        <MenuIcon className="Icon" onClick={ this.handleMenu } />
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
      this.props.openModal(MODALS.SubscribeMenu, {feeds})
    }
  }

  handleMenu(event) {
    const el = event.target;
    const modalName = event.shiftKey ? MODALS.DebugMenu : MODALS.FeedTreeMenu
    this.props.openModalRightAlignedBelow(el, modalName)
  }
}

const mapStateToProps = (state, props) => ({
  availableFeeds: discovery.selectors.availableFeeds(state, activeTab.selectors.getActiveTabId(state))
})

export default connect(mapStateToProps, {
  addFeed,
  fetchAll,
  openModal,
  openModalRightAlignedBelow,
})(FeedTreeToolbar)