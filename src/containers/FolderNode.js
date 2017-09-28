import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import folders from '../redux/modules/folders'
import NodeList from '../components/NodeList'

class FolderNode extends React.Component {

  static propTypes = {
    folder: PropTypes.object.isRequired
  }

  render() {
    const {folder, children} = this.props

    return (
      <li className="FolderNode">
        {folder.name}
        <NodeList nodes={children}/>
      </li>
    )
  }
}

const mapStateToProps = (state, props) => ({
  children: folders.selectors.getChildren(state, props.folder)
})

export default connect(mapStateToProps, {
  // actions
})(FolderNode)