import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import feeds, { addFeed, fetchAll } from '../redux/modules/feeds'
import workers from '../redux/modules/workers'
import { openModal, openModalRightAlignedBelow } from '../redux/modules/modal'
import discovery from '../redux/modules/discovery'
import activeTab from '../redux/modules/activeTab'

import { MODALS } from '../modals'

import RefreshIcon from 'react-icons/lib/fa/refresh'
import MenuIcon from 'react-icons/lib/fa/ellipsis-v'

class FeedTreeToolbar extends React.Component {
  static propTypes = {
    availableFeeds: PropTypes.array.isRequired,
    allFeedsByUrl: PropTypes.object.isRequired,
    isFetching: PropTypes.bool,
    addFeed: PropTypes.func.isRequired,
    fetchAll: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    openModalRightAlignedBelow: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.handleNewSubscription = this.handleNewSubscription.bind(this)
    this.handleMenu = this.handleMenu.bind(this)
  }

  render() {
    const { fetchAll, isFetching } = this.props
    
    return (
      <span>
        { this.renderSubscribeButton() }
        <RefreshIcon className={`Icon ${isFetching ? "isSpinning" : ""}`} title="Refresh Feeds" onClick={ fetchAll } />
        <MenuIcon className="Icon" onClick={ this.handleMenu } />
      </span>
    )
  }

  renderSubscribeButton() {
    const {availableFeeds, allFeedsByUrl} = this.props
    const hasFeeds = availableFeeds.length > 0
    const allSubscribed = availableFeeds.every(feed => allFeedsByUrl[feed.url])

    if (!hasFeeds) { return }
    
    if (allSubscribed) {
      return (
        <span className="secondary">
          Subscribed 
          {" "}
        </span>
      )
    } else {
      return (
        <a title="Subscribe to Feed" onClick={this.handleNewSubscription} className="isActive">
          Subscribe{availableFeeds.length > 1 ? "… " : " "}
        </a>
      )
    }
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
    const el = event.target
    const modalName = event.shiftKey ? MODALS.DebugMenu : MODALS.FeedTreeMenu
    this.props.openModalRightAlignedBelow(el, modalName)
  }
}

const mapStateToProps = (state, props) => ({
  availableFeeds: discovery.selectors.availableFeeds(state, activeTab.selectors.getActiveTabId(state)),
  allFeedsByUrl: feeds.selectors.allFeedsByUrl(state),
  isFetching: workers.selectors.hasFeedWorkers(state),
})

export default connect(mapStateToProps, {
  addFeed,
  fetchAll,
  openModal,
  openModalRightAlignedBelow,
})(FeedTreeToolbar)