import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { CheckCircle as MarkReadIcon, MoreVertical as MenuIcon } from 'react-feather'

import { markAllItemsViewed } from '../redux/modules/views'
import { clearSelection } from '../redux/modules/ui'
import { openModalRightAlignedBelow } from '../redux/modules/modal'

import { MODALS } from '../modals'
import feeds from '../redux/modules/feeds'
import type { Feed } from '../redux/types'
import type { ItemNode } from '../components/ItemList'

type OwnProps = {
  feed: Feed
  itemNodes: ItemNode[]
}

const connector = connect(null, {
  markAllItemsViewed,
  clearSelection,
  openModalRightAlignedBelow,
})

class FeedDetailToolbar extends React.PureComponent<OwnProps & ConnectedProps<typeof connector>> {
  render() {
    const { feed, itemNodes } = this.props

    return (
      <div className="Panel-header">
        <span>
          {this.renderTitle(feed)}
        </span>
        <span>
          {
            itemNodes.some(i => i.isUnread) &&
            <MarkReadIcon className="Icon" onClick={this.handleMarkAllRead} />
          }
        </span>
        <span>
          <MenuIcon className="Icon" onClick={ this.handleMenu } />
        </span>
      </div>
    )
  }

  renderTitle(feed: Feed) {
    const title = feeds.selectors.getFeedTitle(feed)
    if (!title) return 'Articles'

    return <a href={feed.linkUrl}>{title}</a>
  }

  handleMarkAllRead = () => {
    this.props.markAllItemsViewed(this.props.feed)
  }

  handleBack = () => {
    this.props.clearSelection()
  }

  handleMenu = (event: React.MouseEvent<Element>) => {
    const feed = this.props.feed
    const el = event.currentTarget
    this.props.openModalRightAlignedBelow(el, MODALS.FeedMenu, {
      feed
    })
  }
}

export default connector(FeedDetailToolbar)
