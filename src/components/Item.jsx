import React from 'react'
import PropTypes from 'prop-types'

import StatusIndicator from '../components/icons/StatusIndicator'

class Item extends React.PureComponent {

  static propTypes = {
    item: PropTypes.object.isRequired,
    isUnread: PropTypes.bool,
    onClick: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string,
  }

  static defaultProps = {
    onClick: (event) => true,
    className: "",
  }

  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  render() {
    const {item, isUnread, style, className} = this.props
    const readClass = isUnread ? "isUnread" : "isRead"
    const error = item.error

    return (
      <div className={`Item ${readClass} ${className}`} style={style} > 
        <StatusIndicator isUnread={isUnread} hasError={!!error} />
        {error ? this.renderError(error, item) : this.renderLink(item)}
      </div>
    )
  }

  renderLink(item) {
    return (
      <a href={item.url} onClick={ this.handleClick } title={item.title}>
        {item.title}
      </a>
    )
  }

  renderError(_error, _item) {
    return (
      <span className="hasError" onClick={ this.handleClick }> Parse Error</span>
    )
  }

  handleClick(event) {
    const item = this.props.item
    
    if (item.error) {
      console.error("Brook Item Error:", item.error)
      console.error(item.data)
    } else {
      this.props.onClick(this.props.item)
    }
  }
}

export default Item