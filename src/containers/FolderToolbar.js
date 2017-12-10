import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'

import { removeBranch, editFolder } from '../redux/modules/folders'

class FolderToolbar extends Component {

  static propTypes = {
    folder: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.handleRemove = this.handleRemove.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
  }

  render() {
    return (
      <span>
        <a title="Edit" onClick={ this.handleEdit }>(e)</a>
        <a title="Remove" onClick={ this.handleRemove }>(x)</a>
      </span>
    )
  }

  handleRemove() {
    this.props.removeBranch(this.props.folder)
  }

  handleEdit() {
    this.props.editFolder(this.props.folder)
  }
}

const mapStateToProps = (state, props) => ({
  // props
})

export default connect(mapStateToProps, {
  removeBranch,
  editFolder
})(FolderToolbar)