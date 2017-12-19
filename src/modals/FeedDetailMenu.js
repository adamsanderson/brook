import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import { closeModal } from '../redux/modules/modal'
import { removeFeed } from '../redux/modules/feeds'

class FeedDetailMenu extends Component {

  static propTypes = {
    feed: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.handleRemove = this.handleRemove.bind(this)
  }

  render() {    
    const {targetRegion, importSample} = this.props
    const position = {
      top: targetRegion.bottom + 5, 
      right: document.body.clientWidth - targetRegion.right,
    }
    
    return (
      <div className="Modal" onClick={ this.props.closeModal }>
        <div className="Menu" style={position}>
          <div>
            <a onClick={ this.handleRemove }>Delete Feed</a>
          </div>
        </div>
      </div>
    )
  }

  handleRemove() {
    this.handleClose()

    this.props.removeFeed(this.props.feed)
  }

  handleClose() {
    this.props.closeModal()
  }
}

const mapStateToProps = (state, props) => ({
  // state...
})

export default connect(mapStateToProps, {
  closeModal,
  removeFeed,
})(FeedDetailMenu)