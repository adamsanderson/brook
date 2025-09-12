import React from 'react'
import PropTypes from 'prop-types'

import Item from '../components/Item'

export default class ItemList extends React.PureComponent {
  static propTypes = {
    itemNodes: PropTypes.array.isRequired,
    onClickItem: PropTypes.func,
  }

  static defaultProps = {
    onClickItem: (item) => true,
  }

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