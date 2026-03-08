import React from 'react'

import ItemList, { type ItemNode } from '../components/ItemList'
import type { Feed } from '../redux/types'

type Props = {
  feed?: Feed
  onUseAlternate: (feed: Feed) => void
  onClickItem: (item: ItemNode['item']) => void
  itemNodes: ItemNode[]
}

class FeedDetail extends React.PureComponent<Props> {
  render() {
    const { feed, itemNodes } = this.props

    if (!feed) {
      return this.renderPendingState()
    }

    if (feed.error && feed.alternate && feed.alternate.url) {
      return this.renderFixFeedState(feed)
    }

    if (feed.error) {
      return this.renderErrorState(feed)
    }

    if (itemNodes.length === 0) {
      return this.renderEmptyState(feed)
    }

    return this.renderContent(itemNodes)
  }

  renderErrorState(feed: Feed) {
    return (
      <div>
        <p className="hasError">
          There was an error reading this feed: &nbsp;
          <a href={feed.url}>View page</a>
        </p>
        <p>
          <code>{feed.error}</code>
        </p>
      </div>
    )
  }

  renderFixFeedState(feed: Feed) {
    const url = feed.alternate?.url
    if (!url) return this.renderErrorState(feed)

    return (
      <div>
        <p className="hasError">
          Feed may have moved to
          {" "} <a href={url}>{url}</a>
        </p>
        <p>
          <button className="Button isActive" onClick={this.handleUseAlternate}>
            Update Url
          </button>
        </p>
      </div>
    )
  }

  renderPendingState() {
    return (
      <p>

      </p>
    )
  }

  renderEmptyState(feed: Feed) {
    return (
      <p>
        {feed.isLoading ? "Loading…" : "No published articles"}
      </p>
    )
  }

  renderContent(itemNodes: ItemNode[]) {
    return <ItemList itemNodes={itemNodes} onClickItem={this.props.onClickItem} />
  }

  handleUseAlternate = () => {
    const feed = this.props.feed
    if (!feed) return

    this.props.onUseAlternate(feed)
  }
}

export default FeedDetail
