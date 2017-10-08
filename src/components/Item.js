import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'

import StatusIndicator from '../components/icons/StatusIndicator'

class Item extends Component {

  static propTypes = {
    item: PropTypes.object.isRequired,
    isUnread: PropTypes.bool,
    onClick: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string,
  }

  static defaultProps = {
    isUnread: false,
    onClick: (event) => true,
    className: "",
  }

  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    const {item, isUnread, style, className} = this.props
    const readClass = isUnread ? "isUnread" : "isRead"

    return (
      <div className={`Item ${readClass} ${className}`} style={style} > 
        <StatusIndicator isUnread={isUnread} />
        <a href={item.url} onClick={ this.handleClick }>
          {item.title}
        </a>
      </div>
    )
  }

  handleClick(event) {
    this.props.onClick(this.props.item)
  }
}

export default Item