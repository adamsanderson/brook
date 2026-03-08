import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { MoreVertical as MenuIcon, RefreshCw as RefreshIcon } from 'react-feather'

import { addFeed, fetchAll } from '../redux/modules/feeds'
import workers from '../redux/modules/workers'
import { openModal, openModalLeftAlignedBelow, openModalRightAlignedBelow } from '../redux/modules/modal'
import ui from '../redux/modules/ui'
import discovery from '../redux/modules/discovery'
import activeTab from '../redux/modules/activeTab'

import { MODALS } from '../modals'
import type { RootState } from '../redux/types'

const mapStateToProps = (state: RootState) => ({
  currentViewName: ui.selectors.currentViewName(state),
  unsubscribedFeeds: discovery.selectors.unsubscribedFeeds(state, activeTab.selectors.getActiveTabId(state) ?? -1),
  isFetching: workers.selectors.hasFeedWorkers(state),
})

const connector = connect(mapStateToProps, {
  addFeed,
  fetchAll,
  openModal,
  openModalLeftAlignedBelow,
  openModalRightAlignedBelow,
})

class FeedTreeToolbar extends React.PureComponent<ConnectedProps<typeof connector>> {
  render() {
    const { fetchAll, isFetching } = this.props

    return (
      <div className="Panel-header">
        <span className="isActionable" onClick={ this.handleViewMenu }>
          {this.props.currentViewName}
        </span>
        <span>
          { this.renderSubscribeButton() }
          <RefreshIcon className={`Icon ${isFetching ? 'isSpinning' : ''}`} onClick={ () => { fetchAll() } } />
          <MenuIcon className="Icon" onClick={ this.handleMenu } />
        </span>
      </div>
    )
  }

  renderSubscribeButton() {
    const { unsubscribedFeeds } = this.props
    if (unsubscribedFeeds.length === 0) return null

    return (
      <a title="Subscribe to Feed" onClick={this.handleNewSubscription} className="isActive">
        Subscribe{unsubscribedFeeds.length > 1 ? '… ' : ' '}
      </a>
    )
  }

  handleNewSubscription = () => {
    const feeds = this.props.unsubscribedFeeds

    if (!feeds.length) {
      return
    }

    if (feeds.length === 1) {
      this.props.addFeed(feeds[0], { fetch: true })
    } else {
      this.props.openModal(MODALS.SubscribeMenu, { feeds })
    }
  }

  handleViewMenu = (event: React.MouseEvent<Element>) => {
    const el = event.currentTarget
    const modalName = MODALS.TreeViewMenu
    this.props.openModalLeftAlignedBelow(el, modalName)
  }

  handleMenu = (event: React.MouseEvent<Element>) => {
    const el = event.currentTarget
    const modalName = event.shiftKey ? MODALS.DebugMenu : MODALS.FeedTreeMenu
    this.props.openModalRightAlignedBelow(el, modalName)
  }
}

export default connector(FeedTreeToolbar)
