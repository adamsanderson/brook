import React from 'react'
import PropTypes from 'prop-types'

import ItemList from '../components/ItemList'

class FeedDetail extends React.PureComponent {
  static propTypes = {
    feed: PropTypes.object,
    onUseAlternate: PropTypes.func.isRequired,
    onClickItem: PropTypes.func.isRequired,
    itemNodes: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props)

    this.handleUseAlternate = this.handleUseAlternate.bind(this)
  }

  render() {
    const {feed, itemNodes} = this.props

    if (!feed) {
      return this.renderPendingState()
    } else if (feed.error && feed.alternate && feed.alternate.url) {
      return this.renderFixFeedState(feed)
    } else if (feed.error) {
      return this.renderErrorState(feed)
    } else if (itemNodes.length === 0) {
      return this.renderEmptyState(feed)
    } else {
      return this.renderContent(itemNodes)
    }
  }

  renderErrorState(feed) {
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

  renderFixFeedState(feed) {
    const url = feed.alternate.url

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

  renderEmptyState(feed) {
    return (
      <p>
        {feed.isLoading ? "Loading…" : "No published articles"}
      </p>
    )
  }

  renderContent(itemNodes) {
    return <ItemList itemNodes={itemNodes} onClickItem={this.props.onClickItem} />
  }

  handleUseAlternate() {
    const feed = this.props.feed
    this.props.onUseAlternate(feed)
  }
}

export default FeedDetail