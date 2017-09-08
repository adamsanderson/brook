import React, {Component, PropTypes} from 'react'
import FeedNode from './FeedNode'

class FeedList extends Component {
  static propTypes = {
    feeds: PropTypes.array.isRequired
  }

  render() {
    const {feeds} = this.props;
    
    return (
      <ul> 
        { feeds.map(f => <FeedNode node={f} />) }
      </ul>
    )
  }
}

export default FeedList