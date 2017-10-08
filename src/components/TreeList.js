import React, {Component, PropTypes} from 'react'
import { FEED } from '../redux/modules/feeds'
import { FOLDER } from '../redux/modules/folders'
import FeedNode from '../containers/FeedNode'
import FolderNode from '../containers/FolderNode'
import FolderIcon from './icons/Folder'

class TreeList extends Component {
  static propTypes = {
    nodes: PropTypes.array.isRequired,
    indent: PropTypes.number,
  }

  static defaultProps = {
    indent: 1,
    indentUnits: "em"
  }

  render() {
    const {nodes} = this.props

    return (
      <div className="TreeList">
        {nodes.map((n) => this.renderNode(n))}
      </div>
    )
  }

  renderNode(node) {
    const {indent, indentUnits} = this.props
    const {item} = node
    const style = {paddingLeft: indent * node.depth + indentUnits}

    return (
      <div className="TreeList-node" key={`${item.type}-${item.id}`} style={style} >
        {this.renderItem(item)}
      </div>
    ) 
  }

  renderItem(item) {
    switch (item.type) {
      case FEED: 
        return <FeedNode feed={item} />
      case FOLDER:
        return <FolderNode folder={item} />
      default:
        console.error("Unkown node type: ", item)
        throw new Error(`Unknown node type: ${item.type}`)
    }
  }
}

export default TreeList