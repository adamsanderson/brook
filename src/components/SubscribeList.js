import React from 'react'
import PropTypes from 'prop-types'

import StatusIndicator from '../components/icons/StatusIndicator'

class SubscribeList extends React.Component {
  
  static propTypes = {
    feeds: PropTypes.array.isRequired,
    onSubscribe: PropTypes.func.isRequired,
  }

  render() {
    return (
      <ul className="List">
        {this.props.feeds.map(feed => (
          <li key={feed.url} className="List-item">
            <StatusIndicator />
            <a onClick={ (event) => this.props.onSubscribe(feed) } title={feed.title}>
              {feed.title}
            </a>
          </li>
        ))}
      </ul>
    )
  }
}

export default SubscribeList