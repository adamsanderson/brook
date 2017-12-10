import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'

import { removeFeed } from '../redux/modules/feeds'

class FeedDetailToolbar extends Component {

  static propTypes = {
    feed: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.handleRemove = this.handleRemove.bind(this)
  }

  render() {
    return (
      <span>
        <a title="Remove" onClick={ this.handleRemove }>(x)</a>
      </span>
    )
  }

  handleRemove() {
    this.props.removeFeed(this.props.feed)
  }
}

const mapStateToProps = (state, props) => ({
  // props
})

export default connect(mapStateToProps, {
  removeFeed
})(FeedDetailToolbar)