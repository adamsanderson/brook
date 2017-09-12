import React, {Component, PropTypes} from 'react'

class ItemList extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
  }

  render() {
    const { items } = this.props;
    
    return (
      <ul className="ItemList"> 
        { items.map(item => (
          <li className="ItemList-item">
            <a href={item.url}>{item.title}</a>
          </li>
        )) }
      </ul>
    )
  }
}

export default ItemList