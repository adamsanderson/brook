import React, {Component, PropTypes} from 'react'
import FeedNode from './FeedNode'

class FeedList extends Component {
  static propTypes = {
    feeds: PropTypes.array.isRequired,
    onClickFeed: PropTypes.func.isRequired,
    isFeedUnread: PropTypes.func,
  }

  static defaultProps = {
    isFeedUnread: (feed) => false,
  }

  render() {
    const { feeds, onClickFeed, isFeedUnread } = this.props;
    
    return (
      <ul className="FeedList"> 
        { feeds.map(f => <FeedNode node={f} onClick={onClickFeed} unread={isFeedUnread(f)} />) }
      </ul>
    )
  }
}

export default FeedList