import React from 'react'

import type { Folder } from '../redux/types'

type Props = {
  folder: Folder
  onRename?: (folder: Folder, title: string) => void
}

class FolderEditor extends React.PureComponent<Props> {
  private input: HTMLInputElement | null = null

  componentDidMount() {
    this.input?.select()
  }

  render() {
    const { folder } = this.props

    return (
      <input
        defaultValue={folder.title}
        ref={el => {
          this.input = el
        }}
        onBlur={this.handleSubmit}
        onKeyUp={this.handleKey}
      />
    )
  }

  handleSubmit = () => {
    const onRename = this.props.onRename
    if (!onRename || !this.input) return

    onRename(this.props.folder, this.input.value)
  }

  handleKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      this.handleSubmit()
      return
    }

    if (event.key === 'Escape' && this.input) {
      this.input.value = this.props.folder.title
      this.input.blur()
    }
  }
}

export default FolderEditor
