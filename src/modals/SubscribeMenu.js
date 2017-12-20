import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import { addFeed } from '../redux/modules/feeds'
import { closeModal } from '../redux/modules/modal'

import StatusIndicator from '../components/icons/StatusIndicator'
import BackIcon from 'react-icons/lib/fa/chevron-left'

class SubscribeMenu extends Component {
  render() {
    return (
      <div className="Modal inverted layout-vertical">
        <p className="Panel-header">
          <a onClick={ (event) => this.handleClose() }>
            <BackIcon /> 
            {" "}
            Back to Feeds
          </a>
        </p>
        
        <div className="Panel-body">
          <p>
            Subscribe to:
          </p>
          <ul className="List">
          {this.props.feeds.map(feed => (
            <li key={feed.url} className="List-item">
              <StatusIndicator />
              <a onClick={ (event) => this.handleSubscription(feed) } title={feed.title}>
                {feed.title}
              </a>
            </li>
          ))}
          </ul>
        </div>
      </div>
    )
  }

  handleSubscription(feed) {
    this.props.closeModal()
    this.props.addFeed(feed)
  }

  handleClose() {
    this.props.closeModal()
  }
}

const mapStateToProps = (state, props) => ({
  // state...
})

export default connect(mapStateToProps, {
  addFeed,
  closeModal,
})(SubscribeMenu)