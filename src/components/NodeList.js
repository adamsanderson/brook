import React, {Component, PropTypes} from 'react'

import FolderNode from '../containers/FolderNode'
import FeedNode from '../containers/FeedNode'
import {FOLDER} from '../redux/modules/folders'
import {FEED} from '../redux/modules/feeds'

class NodeList extends Component {
  static propTypes = {
    nodes: PropTypes.array.isRequired,
  }

  render() {
    const { nodes } = this.props;
    
    return (
      <div className="NodeList"> 
        { nodes.map(n => this.renderChild(n)) }
      </div>
    )
  }

  renderChild(child) {
    if (!child) return 
    
    switch (child.type) {
      case FOLDER:
        return <FolderNode key={`folder-${child.id}`} folder={child} />
      case FEED: 
        return <FeedNode key={`feed-${child.id}`} feed={child} />
      default:
        console.error("Unkown node type: ", child)
        throw new Error(`Unknown node type: ${child.type}`)
    }
  }
}

export default NodeList