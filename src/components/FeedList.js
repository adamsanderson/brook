import React, {Component, PropTypes} from 'react'
import FeedNode from './FeedNode'

class FeedList extends Component {
  static propTypes = {
    feeds: PropTypes.array.isRequired,
    onClickFeed: PropTypes.func.isRequired,
  }

  render() {
    const { feeds, onClickFeed } = this.props;
    
    return (
      <ul> 
        { feeds.map(f => <FeedNode node={f} onClick={onClickFeed} />) }
      </ul>
    )
  }
}

export default FeedList