import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'

import { removeBranch } from '../redux/modules/folders'

class FolderToolbar extends Component {

  static propTypes = {
    folder: PropTypes.object.isRequired,
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
    console.log("REMOVE", this.props)
    this.props.removeBranch(this.props.folder)
  }
}

const mapStateToProps = (state, props) => ({
  // props
})

export default connect(mapStateToProps, {
  removeBranch
})(FolderToolbar)