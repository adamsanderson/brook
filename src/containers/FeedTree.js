import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'

import { FEED } from '../redux/modules/feeds'
import folder, { FOLDER, moveNode } from '../redux/modules/folders'
import views from '../redux/modules/views'
import ui, { selectFeed, selectFolder } from '../redux/modules/ui'
import { openModal } from '../redux/modules/modal'
import EmptyImage from 'react-icons/lib/fa/newspaper-o'

import FeedNode from '../components/dnd/DnDFeed'
import FolderNode from '../components/dnd/DnDFolder'
import { MODALS } from '../modals'

class FeedTree extends Component {
  static propTypes = {
    nodes: PropTypes.array.isRequired,
    indent: PropTypes.number,
  }

  static defaultProps = {
    indent: 1,
    indentUnits: "em"
  }

  constructor(props) {
    super(props)

    this.handleShowImport = this.handleShowImport.bind(this)
  }

  render() {
    const {nodes} = this.props

    if (nodes.length === 0) {
      return this.renderEmptyState()
    } else {
      return this.renderContent(nodes)
    }
  }

  renderEmptyState() {
    return (
      <div className="EmptyState">
        <EmptyImage className="EmptyState-icon" />
        <p>
          <a href="http://www.npr.org">Visit</a> a site that publishes feeds, 
          or <a href="#" onClick={this.handleShowImport}>import</a> existing ones.
        </p>
      </div>
    )
  }

  renderContent(nodes) {
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

  handleShowImport(event) {
    event.preventDefault()
    this.props.openModal(MODALS.ImportModal)
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
  openModal
})(FeedTree)