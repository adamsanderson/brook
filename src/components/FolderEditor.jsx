import React from 'react'
import PropTypes from 'prop-types'

class FolderEditor extends React.PureComponent {
  static propTypes = {
    folder: PropTypes.object.isRequired,
    onRename: PropTypes.func,
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
        onBlur={this.handleSubmit}
        onKeyUp={this.handleKey}
      />
    )
  }

  handleSubmit() {
    const onRename = this.props.onRename
    if (!onRename) return

    onRename(this.props.folder, this.input.value)
  }

  handleKey(event) {
    if (event.keyCode === 13) {
      this.handleSubmit()
    } else if (event.keyCode === 27) {
      this.input.value = this.props.folder.title
      this.input.blur()
    }
  }
}

export default FolderEditor