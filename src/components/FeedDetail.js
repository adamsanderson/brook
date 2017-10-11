import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

import ItemList from '../containers/ItemList'

class FeedDetail extends React.Component {
  static propTypes = {
    feed: PropTypes.object,
  }

  render() {
    const feed = this.props.feed

    if (!feed) {
      return this.renderEmptyState()
    } else if (feed.error) {
      return this.renderErrorState(feed)
    } else if (!feed.items || feed.items.length === 0) {
      return this.renderEmptyState()
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

  renderEmptyState() {
    return (
      <p>
        …
      </p>
    )
  }

  renderContent(feed) {
    const items = feed.items

    return <ItemList items={items} />
  }

}

export default FeedDetail