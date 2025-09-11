import React from 'react'
import PropTypes from 'prop-types'

import StatusIndicator from '../components/icons/StatusIndicator'
import feeds from '../redux/modules/feeds'

class SubscribeList extends React.Component {

  static propTypes = {
    feeds: PropTypes.array.isRequired,
    onSubscribe: PropTypes.func.isRequired,
  }

  render() {
    return (
      <ul className="List">
        {this.props.feeds.map(feed => {
          const title = feeds.selectors.getFeedTitle(feed)
          return (
            <li key={feed.url} className="List-item">
              <StatusIndicator />
              <a onClick={(event) => this.props.onSubscribe(feed)} title={title}>
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