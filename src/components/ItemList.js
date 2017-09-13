import React, {Component, PropTypes} from 'react'

class ItemList extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    onClickItem: PropTypes.func,
    isItemUnread: PropTypes.func,
  }

  static defaultProps = {
    onClickItem: (item) => true,
    isItemUnread: (item) => false,
  }

  render() {
    const { items, onClickItem, isItemUnread } = this.props;
    
    return (
      <ul className="ItemList"> 
        { items.map(item => (
          <li className={"ItemList-item " + (isItemUnread(item) ? "isUnread" : "isRead")}>
            <a href={item.url} onClick={ (ev) => onClickItem(item) }>
              {item.title}
            </a>
          </li>
        )) }
      </ul>
    )
  }
}

export default ItemList