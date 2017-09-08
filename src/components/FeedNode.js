import React, {Component} from 'react'

class FeedNode extends Component {
  render() {
    const {node} = this.props;
    
    return (
      <li> 
        <a href={node.url}>{node.title}</a>
      </li>
    )
  }
}

export default FeedNode