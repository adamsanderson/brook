import React from 'react'

import FolderIcon from '../components/icons/FolderIcon'
import FolderEditor from './FolderEditor'
import type { Folder as FolderType } from '../redux/types'

type Props = {
  folder: FolderType
  onClick?: (folder: FolderType) => void
  onRename?: (folder: FolderType, title: string) => void
  style?: React.CSSProperties
  className?: string
}

class Folder extends React.PureComponent<Props> {
  render() {
    const { folder, style, onRename } = this.props
    const className = this.props.className || ""

    return (
      <div className={`Folder ${className}`} style={style} onClick={this.handleClick}>
        <FolderIcon expanded={folder.expanded} />
        {
          folder.isEditing
            ? <FolderEditor folder={folder} onRename={onRename} />
            : <span>{folder.title}</span>
        }
      </div>
    )
  }

  handleClick = () => {
    this.props.onClick?.(this.props.folder)
  }
}

export default Folder
