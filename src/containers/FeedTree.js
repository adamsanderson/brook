import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { FEED, removeFeed } from '../redux/modules/feeds'
import folder, { FOLDER, moveNode, renameFolder } from '../redux/modules/folders'
import views from '../redux/modules/views'
import ui, { selectFeed, selectFolder } from '../redux/modules/ui'
import { openModal } from '../redux/modules/modal'
import FeedNode from '../components/dnd/DnDFeed'
import FolderNode from '../components/dnd/DnDFolder'
import { MODALS } from '../modals'
import discovery from '../redux/modules/discovery'
import activeTab from '../redux/modules/activeTab'
import { ReadImage } from '../components/images'


class FeedTree extends React.PureComponent {
  static propTypes = {
    nodes: PropTypes.array.isRequired,
    indent: PropTypes.number,
    indentUnits: PropTypes.string, 
    currentFeed: PropTypes.object, 
    currentFolder: PropTypes.object,
    hasAvailableFeeds: PropTypes.bool.isRequired,
    selectFolder: PropTypes.func.isRequired,
    renameFolder: PropTypes.func.isRequired,
    selectFeed: PropTypes.func.isRequired,
    moveNode: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    allowDrop: PropTypes.func.isRequired,
    isFeedUnread: PropTypes.func.isRequired,
    removeFeed: PropTypes.func.isRequired
  }

  static defaultProps = {
    indent: 1,
    indentUnits: "em"
  }

  constructor(props) {
    super(props)

    this.handleShowImport = this.handleShowImport.bind(this)
    this.depthStyleCache = []
  }

  getDepthStyle(depth) {
    if (!this.depthStyleCache[depth]) {
      const {indent, indentUnits} = this.props
      this.depthStyleCache[depth] = {paddingLeft: indent * depth + indentUnits}
    }

    return this.depthStyleCache[depth]
  }

  render() {
    const {nodes} = this.props

    if (nodes.length === 0) {
      return this.props.hasAvailableFeeds 
        ? this.renderSubscribeEmptyState() 
        : this.renderEmptyState()
    } else {
      return this.renderContent(nodes)
    }
  }

  renderEmptyState() {
    return (
      <div className="EmptyState layout-vertical">
        <h2>Getting Started</h2>
        <ReadImage className="layout-hero" />
        <p>
          <a href="http://www.npr.org">Visit</a> a site that publishes feeds, 
          or <a href={browser.runtime.getURL('import.html')}>import</a> existing ones.
        </p>
      </div>
    )
  }

  renderSubscribeEmptyState() {
    return (
      <div className="EmptyState layout-vertical">
        <h2>Subscribe</h2>
        <ReadImage className="layout-hero" />
        <p>
          Click the <b>Subscribe</b> button
          to add this site to your feed list.
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
    const {currentFeed, currentFolder} = this.props
    const {item} = node
    const isSelected = item === currentFeed || item === currentFolder
    const childProps = {
      style: this.getDepthStyle(node.depth),
      className: `List-item ${isSelected ? "isSelected" : ""}`,
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
            onDelete={isSelected ? this.props.removeFeed : undefined}
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
            onRename={this.props.renameFolder }
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
  hasAvailableFeeds: discovery.selectors.hasAvailableFeeds(state, activeTab.selectors.getActiveTabId(state)),
  allowDrop: (draggable, dropTarget) => {
    return !folder.selectors.containsNode(state, draggable, dropTarget)
  }
})

export default connect(mapStateToProps, {
  selectFolder,
  selectFeed,
  moveNode,
  openModal,
  renameFolder,
  removeFeed,
})(FeedTree)