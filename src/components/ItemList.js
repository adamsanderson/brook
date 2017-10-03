import React, {Component, PropTypes} from 'react'
import StatusIndicator from './icons/StatusIndicator'

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
    const { items, onClickItem, isItemUnread } = this.props

    return (
      <div className="NodeList"> 
        { items.map(item => (
          <div title={item.title} className={"Item " + (isItemUnread(item) ? "isUnread" : "isRead")}>
            <StatusIndicator isUnread={isItemUnread(item)} />
            <a href={item.url} onClick={ (ev) => onClickItem(item) }>
              {item.title}
            </a>
          </div>
        )) }
      </div>
    )
  }
}

export default ItemList