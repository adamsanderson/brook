import React from 'react'

import StatusIndicator from '../components/icons/StatusIndicator'
import feeds from '../redux/modules/feeds'
import type { Feed } from '../redux/types'

type Props = {
  feeds: Feed[]
  onSubscribe: (feed: Feed) => void
}

class SubscribeList extends React.Component<Props> {

  render() {
    return (
      <ul className="List">
        {this.props.feeds.map(feed => {
          const title = feeds.selectors.getFeedTitle(feed)
          return (
            <li key={feed.url} className="List-item">
              <StatusIndicator />
              <a onClick={() => this.props.onSubscribe(feed)} title={title}>
                {title}
              </a>
            </li>
          )
        })}
      </ul>
    )
  }
}

export default SubscribeList
