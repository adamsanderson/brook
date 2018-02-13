import React from 'react'
import PropTypes from 'prop-types'

import ItemList from '../containers/ItemList'

class FeedDetail extends React.Component {
  static propTypes = {
    feed: PropTypes.object,
  }

  render() {
    const feed = this.props.feed

    if (!feed) {
      return this.renderPendingState()
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
          There was an error reading this feed.
        </p>
        <p>
          <code>{feed.error}</code>
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

}

export default FeedDetail