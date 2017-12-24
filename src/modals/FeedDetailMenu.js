import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'

import PopupLayout from './layouts/PopupLayout'
import { removeFeed } from '../redux/modules/feeds'

class FeedDetailMenu extends Component {

  static propTypes = {
    feed: PropTypes.object.isRequired,
    position: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.handleRemove = this.handleRemove.bind(this)
  }

  render() {    
    const { position } = this.props
    
    return (
      <PopupLayout position={position} onClose={this.props.closeModal}>
        <div>
          <a onClick={ this.handleRemove }>Delete Feed</a>
        </div>
      </PopupLayout>
    )
  }

  handleRemove() {
    this.props.closeModal()
    this.props.removeFeed(this.props.feed)
  }
}

const mapStateToProps = (state, props) => ({
  // state...
})

export default connect(mapStateToProps, {
  removeFeed,
})(FeedDetailMenu)