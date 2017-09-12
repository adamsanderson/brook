import React, {Component, PropTypes} from 'react'

class FeedNode extends Component {

  static propTypes = {
    onClick: PropTypes.func.isRequired,
    node: PropTypes.node.isRequired,
  }

  constructor(props) {
    super(props)
    this.handleOnClick = this.handleOnClick.bind(this)
  }

  render() {
    const {node} = this.props;
    
    return (
      <li className="FeedNode"> 
        <a onClick={this.handleOnClick}>{node.title}</a>
      </li>
    )
  }

  handleOnClick() {
    this.props.onClick(this.props.node)
  }
}

export default FeedNode