import React, {Component, PropTypes} from 'react'

class FeedNode extends Component {

  static propTypes = {
    onClick: PropTypes.func.isRequired,
    node: PropTypes.node.isRequired,
    unread: PropTypes.bool,
  }

  static defaultProps = {
    unread: false
  }

  constructor(props) {
    super(props)
    this.handleOnClick = this.handleOnClick.bind(this)
  }

  render() {
    const {node, unread} = this.props
    const readClass = unread ? "isUnread" : "isRead"

    return (
      <li className={"FeedNode " + readClass}> 
        <a onClick={this.handleOnClick}>{node.title}</a>
      </li>
    )
  }

  handleOnClick() {
    this.props.onClick(this.props.node)
  }
}

export default FeedNode