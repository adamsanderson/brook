import React from 'react'
import PropTypes from 'prop-types'

import ItemList from '../containers/ItemList'

class FeedDetail extends React.PureComponent {
  static propTypes = {
    feed: PropTypes.object,
    onUseAlternate: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.handleUseAlternate = this.handleUseAlternate.bind(this)
  }

  render() {
    const feed = this.props.feed

    if (!feed) {
      return this.renderPendingState()
    } else if (feed.error && feed.alternate && feed.alternate.url) {
      return this.renderFixFeedState(feed)
    } else if (feed.error) {
      return this.renderErrorState(feed)
    } else if (!feed.items || feed.items.length === 0) {
      return this.renderEmptyState(feed)
    } else {
      return this.renderContent(feed)
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

  renderContent(feed) {
    const items = feed.items

    return <ItemList items={items} />
  }

  handleUseAlternate() {
    const feed = this.props.feed
    this.props.onUseAlternate(feed)
  }
}

export default FeedDetail