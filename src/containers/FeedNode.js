import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'

import views from '../redux/modules/views'
import { selectFeed } from '../redux/modules/ui'
import StatusIndicator from '../components/icons/StatusIndicator'

class FeedNode extends Component {

  static propTypes = {
    feed: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    isFeedUnread: PropTypes.bool,
  }

  static defaultProps = {
    isFeedUnread: () => false
  }

  constructor(props) {
    super(props)
    this.handleOnClick = this.handleOnClick.bind(this)
  }

  render() {
    const {feed, isFeedUnread} = this.props
    const isUnread = isFeedUnread(feed)
    const readClass = isUnread ? "isUnread" : "isRead"

    return (
      <div className={"FeedNode " + readClass}> 
        <StatusIndicator isUnread={isUnread} />
        <a onClick={this.handleOnClick}>{feed.title}</a>
      </div>
    )
  }

  handleOnClick() {
    this.props.onClick(this.props.feed)
  }
}

const mapStateToProps = (state, props) => ({
  isFeedUnread: views.selectors.isFeedUnread(state),
})

export default connect(mapStateToProps, {
  onClick: selectFeed
})(FeedNode)