import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { renameFolder } from '../redux/modules/folders'

class FolderEditor extends React.Component {
  static propTypes = {
    folder: PropTypes.object.isRequired,
    renameFolder: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleKey = this.handleKey.bind(this)
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
        onKeyUp={ this.handleKey }
      />
    )
  }

  handleSubmit() {
    this.props.renameFolder(this.props.folder, this.input.value)
  }

  handleKey(event) {
    if (event.keyCode === 13) {
      this.handleSubmit()
    } else if (event.keyCode === 27 ) {
      this.input.value = this.props.folder.title
      this.input.blur()
    }
  }
}

const mapStateToProps = (state, props) => ({
  //
})

export default connect(mapStateToProps, {
  renameFolder
})(FolderEditor)