import React from 'react'
import browser from 'webextension-polyfill'
import { connect, ConnectedProps } from 'react-redux'

import { FEED, removeFeed, renameFeed } from '../redux/modules/feeds'
import folder, { FOLDER, moveNode, renameFolder } from '../redux/modules/folders'
import ui, { selectFeed, selectFolder } from '../redux/modules/ui'
import { openModal } from '../redux/modules/modal'
import FeedNode from '../components/dnd/DnDFeed'
import FolderNode from '../components/dnd/DnDFolder'
import { MODALS } from '../modals'
import discovery from '../redux/modules/discovery'
import activeTab from '../redux/modules/activeTab'
import { ReadImage } from '../components/images'
import type { Feed, Folder, NodeRef, RootState } from '../redux/types'

type TreeNode = {
  depth: number
  id: string
  item: Feed | Folder
  isUnread?: boolean
}

type OwnProps = {
  nodes: TreeNode[]
  indent?: number
  indentUnits?: string
}

const mapStateToProps = (state: RootState) => ({
  currentFeed: ui.selectors.currentFeed(state),
  currentFolder: ui.selectors.currentFolder(state),
  hasAvailableFeeds: discovery.selectors.hasAvailableFeeds(state, activeTab.selectors.getActiveTabId(state) ?? -1),
  allowDrop: (draggable: NodeRef, dropTarget: NodeRef) => {
    const draggableNode = draggable.type === FEED ? state.feeds[draggable.id] : state.folders[draggable.id]
    const dropTargetNode = dropTarget.type === FEED ? state.feeds[dropTarget.id] : state.folders[dropTarget.id]
    if (!draggableNode || !dropTargetNode) return false

    return !folder.selectors.containsNode(state, draggableNode, dropTargetNode)
  }
})

const connector = connect(mapStateToProps, {
  selectFolder,
  selectFeed,
  moveNode,
  openModal,
  renameFolder,
  renameFeed,
  removeFeed,
})

class FeedTree extends React.PureComponent<OwnProps & ConnectedProps<typeof connector>> {
  static defaultProps = {
    indent: 1,
    indentUnits: 'em'
  }

  private depthStyleCache: React.CSSProperties[] = []

  getDepthStyle(depth: number) {
    if (!this.depthStyleCache[depth]) {
      const indent = this.props.indent ?? 1
      const indentUnits = this.props.indentUnits ?? 'em'
      this.depthStyleCache[depth] = { paddingLeft: `${indent * depth}${indentUnits}` }
    }

    return this.depthStyleCache[depth]
  }

  render() {
    const { nodes } = this.props

    if (nodes.length === 0) {
      return this.props.hasAvailableFeeds
        ? this.renderSubscribeEmptyState()
        : this.renderEmptyState()
    }

    return this.renderContent(nodes)
  }

  renderEmptyState() {
    return (
      <div className="EmptyState layout-vertical">
        <h2>Getting Started</h2>
        <ReadImage className="layout-hero" />
        <p>
          <a href="http://www.npr.org">Visit</a> a site that publishes feeds,
          or <a href={browser.runtime.getURL('src/Import/index.html')}>import</a> existing ones.
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

  renderContent(nodes: TreeNode[]) {
    return (
      <div className="List">
        {nodes.map((n) => this.renderNode(n))}
      </div>
    )
  }

  renderNode(node: TreeNode) {
    const { currentFeed, currentFolder } = this.props
    const { item } = node
    const isSelected = item === currentFeed || item === currentFolder
    const childProps = {
      style: this.getDepthStyle(node.depth),
      className: `List-item ${isSelected ? 'isSelected' : ''}`,
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
            onRename={this.props.renameFeed}
            isUnread={node.isUnread}
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
            onRename={this.props.renameFolder}
          />
        )
      default:
        console.error('Unkown node type: ', item)
        throw new Error('Unknown node type')
    }
  }

  handleShowImport = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    this.props.openModal(MODALS.ImportModal)
  }
}

export default connector(FeedTree)
