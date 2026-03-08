import React from 'react'

import Item, { type DisplayItem } from '../components/Item'

export type ItemNode = {
  item: DisplayItem
  isUnread?: boolean
}

type Props = {
  itemNodes: ItemNode[]
  onClickItem?: (item: DisplayItem) => void
}

export default class ItemList extends React.PureComponent<Props> {
  render() {
    const { itemNodes, onClickItem } = this.props

    return (
      <div className="List">
        { itemNodes.map(node => (
          <Item
            key={node.item.id}
            item={node.item}
            isUnread={node.isUnread}
            onClick={onClickItem}
            className="List-item"
          />
        ))}
      </div>
    )
  }
}
