import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'

import { FEED } from '../redux/modules/feeds'
import folder, { FOLDER, moveNode } from '../redux/modules/folders'
import views from '../redux/modules/views'
import ui, { selectFeed, selectFolder } from '../redux/modules/ui'

import FeedNode from '../components/dnd/DnDFeed'
import FolderNode from '../components/dnd/DnDFolder'

class FeedTree extends Component {
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
      <div className="List">
        {nodes.map((n) => this.renderNode(n))}
      </div>
    )
  }

  renderNode(node) {
    const {indent, indentUnits, currentFeed, currentFolder} = this.props
    const {item} = node
    const childProps = {
      style: {paddingLeft: indent * node.depth + indentUnits},
      className: `List-item ${item === currentFeed || item === currentFolder ? "isSelected" : ""}`,
      key: `${item.type}-${item.id}`,
    }
    
    switch (item.type) {
      case FEED: 
        return (
          <FeedNode 
            {...childProps} 
            feed={item} 
            onDrop={this.props.moveNode}
            allowDrop={this.props.allowDrop}
            onClick={this.props.selectFeed} 
            isUnread={this.props.isFeedUnread(item)} 
          />
        )
      case FOLDER:
        return (
          <FolderNode 
            {...childProps} 
            folder={item} 
            allowDrop={this.props.allowDrop}
            onDrop={this.props.moveNode}
            onClick={this.props.selectFolder}
          />
        )
      default:
        console.error("Unkown node type: ", item)
        throw new Error(`Unknown node type: ${item.type}`)
    } 
  }
}

const mapStateToProps = (state, props) => ({
  isFeedUnread: views.selectors.isFeedUnread(state),
  currentFeed: ui.selectors.currentFeed(state),
  currentFolder: ui.selectors.currentFolder(state),
  allowDrop: (draggable, dropTarget) => {
    return !folder.selectors.containsNode(state, draggable, dropTarget)
  }
})

export default connect(mapStateToProps, {
  selectFolder,
  selectFeed,
  moveNode,
})(FeedTree)