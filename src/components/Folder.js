import React from 'react'
import PropTypes from 'prop-types'

import FolderIcon from '../components/icons/FolderIcon'
import FolderEditor from './FolderEditor'

class Folder extends React.PureComponent {

  static propTypes = {
    folder: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    onRename: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  render() {
    const { folder, style, className, onRename } = this.props

    return (
      <div className={`Folder ${className}`} style={style} onClick={this.handleClick} >
        <FolderIcon expanded={folder.expanded} />
        {
          folder.isEditing
            ? <FolderEditor folder={folder} onRename={onRename} />
            : <span>{folder.title}</span>
        }
      </div>
    )
  }

  handleClick(event) {
    this.props.onClick(this.props.folder)
  }
}

export default Folder