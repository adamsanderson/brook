import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'

import StatusIndicator from '../components/icons/StatusIndicator'
import Item from '../components/Item'
import { selectItem } from '../redux/modules/ui'
import views from '../redux/modules/views'

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
      <div className="List"> 
        { items.map(item => (
          <Item item={item} isUnread={isItemUnread(item)} onClick={onClickItem} className="List-item" />
        ))}
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  isItemUnread: views.selectors.isItemUnread(state),
})

export default connect(mapStateToProps, {
  onClickItem: selectItem
})(ItemList)