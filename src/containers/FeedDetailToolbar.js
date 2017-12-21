import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'

import { openModalRightAlignedBelow } from '../redux/modules/modal'
import { MODALS } from '../modals'

import MenuIcon from 'react-icons/lib/fa/ellipsis-v'

class FeedDetailToolbar extends Component {

  static propTypes = {
    feed: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.handleMenu = this.handleMenu.bind(this)
  }

  render() {
    return (
      <span>
        <MenuIcon className="Icon" onClick={ this.handleMenu } />
      </span>
    )
  }

  handleMenu(event) {
    const el = event.target
    this.props.openModalRightAlignedBelow(el, MODALS.FeedDetailMenu, {
      feed: this.props.feed, 
    })
  }
}

const mapStateToProps = (state, props) => ({
  // props
})

export default connect(mapStateToProps, {
  openModalRightAlignedBelow
})(FeedDetailToolbar)