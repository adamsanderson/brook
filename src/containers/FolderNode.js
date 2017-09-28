import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import folders, {toggleFolder} from '../redux/modules/folders'
import NodeList from '../components/NodeList'

class FolderNode extends React.Component {

  static propTypes = {
    folder: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.handleOnClick = this.handleOnClick.bind(this)
  }

  render() {
    const {folder, children} = this.props

    return (
      <li className="FolderNode">
        <a onClick={this.handleOnClick}>{folder.name}</a>
        {folder.expanded && <NodeList nodes={children}/>}
      </li>
    )
  }

  handleOnClick() {
    this.props.onClick(this.props.folder)
  }
}

const mapStateToProps = (state, props) => ({
  children: folders.selectors.getChildren(state, props.folder)
})

export default connect(mapStateToProps, {
  onClick: toggleFolder
})(FolderNode)