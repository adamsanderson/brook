import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'

import { FEED } from '../redux/modules/feeds'
import { FOLDER, toggleFolder } from '../redux/modules/folders'
import views from '../redux/modules/views'
import ui, { selectFeed } from '../redux/modules/ui'

import FeedNode from '../components/Feed'
import FolderNode from '../components/Folder'

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
    const {indent, indentUnits, currentFeed} = this.props
    const {item} = node
    const childProps = {
      style: {paddingLeft: indent * node.depth + indentUnits},
      className: `List-item ${item === currentFeed ? "isSelected" : ""}`,
      key: `${item.type}-${item.id}`,
    }
    
    switch (item.type) {
      case FEED: 
        return <FeedNode {...childProps} feed={item} onClick={this.props.selectFeed} isUnread={this.props.isFeedUnread(item)} />
      case FOLDER:
        return <FolderNode {...childProps} folder={item} onClick={this.props.toggleFolder} />
      default:
        console.error("Unkown node type: ", item)
        throw new Error(`Unknown node type: ${item.type}`)
    } 
  }
}

const mapStateToProps = (state, props) => ({
  isFeedUnread: views.selectors.isFeedUnread(state),
  currentFeed: ui.selectors.currentFeed(state),
})

export default connect(mapStateToProps, {
  toggleFolder,
  selectFeed
})(FeedTree)