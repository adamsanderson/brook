import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import folders, {toggleFolder} from '../redux/modules/folders'
import NodeList from '../components/NodeList'
import FolderIcon from '../components/icons/Folder'

class FolderNode extends React.Component {

  static propTypes = {
    folder: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.handleOnClick = this.handleOnClick.bind(this)
  }

  render() {
    const {folder, children} = this.props

    return (
      <div className="FolderNode">
        <FolderIcon expanded={folder.expanded} />
        <a onClick={this.handleOnClick}>{folder.title}</a>
      </div>
    )
  }

  handleOnClick() {
    this.props.onClick(this.props.folder)
  }
}

const mapStateToProps = (state, props) => ({
  // map props
})

export default connect(mapStateToProps, {
  onClick: toggleFolder
})(FolderNode)