import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

import { connect } from 'react-redux'
import { renameFolder } from '../redux/modules/folders'

class FolderEditor extends React.Component {
  static propTypes = {
    folder: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    this.input.select()
  }

  render() {
    const { folder } = this.props
    
    return (
      <input 
        defaultValue={folder.title} 
        ref={el => this.input = el}
        onBlur={ this.handleSubmit }
      />
    )
  }

  handleSubmit() {
    this.props.renameFolder(this.props.folder, this.input.value)
  }
}

const mapStateToProps = (state, props) => ({
  //
})

export default connect(mapStateToProps, {
  renameFolder
})(FolderEditor)