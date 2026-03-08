import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { addFeed, fetchAll, FEED } from '../redux/modules/feeds'
import { addFolder } from '../redux/modules/folders'

import OpmlReader from '../lib/OpmlReader'
import type { OpmlFeed, OpmlFolder } from '../lib/OpmlReader'
import FileButton from '../components/FileButton'
import FeedComponent from '../components/Feed'
import { ImportImage } from '../components/images'
import type { Feed } from '../redux/types'

type State = {
  error?: string
  imported: Feed[]
}

const connector = connect(null, {
  addFeed,
  addFolder,
  fetchAll,
})

class ImportForm extends React.Component<ConnectedProps<typeof connector>, State> {
  state: State = {
    error: undefined,
    imported: [],
  }

  render() {
    return (
      <div>
        <h2>
          <img src="/icons/Brook.svg" className='Icon'/>
          Import Feeds
        </h2>

        <form>
          {this.state.imported.length === 0 && (
            <>
              <p>
                Import a feed list from other readers or services.
              </p>
              <p>
                <FileButton onChange={this.handleFile} accept=".opml">
                  Select OPML File
                </FileButton>
              </p>
            </>
          )}
          {this.state.error && (
            <p className="hasError">
              {this.state.error}
            </p>
          )}
          {this.state.imported.length > 0 && (
            <p>
              The following feeds have been imported:
            </p>
          )}
          <div className="List">
            {this.state.imported.map((feed) => (
              <FeedComponent className="List-item" key={feed.id} feed={feed}/>
            ))}
          </div>
        </form>

        <ImportImage className='layout-trailing' />
      </div>
    )
  }

  handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files?.length) return

    const file = files[0]

    if (file.type && !file.type.startsWith('text/')) {
      this.fail('File does not appear to be a text OPML file')
      return
    }

    this.importFile(file)
  }

  // This could be extracted, though at the moment it mixes state (feeds imported)
  // and action dispatching. Should Brook need to implement a more nuanced import
  // we should revisit this separation of concerns.
  importFile(file: File) {
    const { addFeed, addFolder, fetchAll } = this.props
    let importedCount = 0

    const reader = new FileReader()
    reader.onerror = () => this.fail('Could not read file')
    reader.onload = (event) => {
      this.resetState()
      const text = event.target?.result
      if (typeof text !== 'string') {
        this.fail('Could not read file')
        return
      }

      const opmlReader = new OpmlReader({
        onFeed: (feed: OpmlFeed, parentId?: string) => {
          if (!feed.url) return

          addFeed({ id: feed.id, title: feed.title || '', url: feed.url }, { parentId })
          importedCount += 1
          this.logFeed(feed)
        },
        onFolder: (folder: OpmlFolder, parentId?: string) => {
          addFolder({ id: folder.id, title: folder.title || '' }, { parentId })
        },
        onFinish: () => {
          fetchAll()

          if (importedCount === 0) {
            this.fail('File does not appear to contain feeds')
          }
        },
      })

      opmlReader.read(text)
    }

    reader.readAsText(file)
  }

  resetState() {
    this.setState({ error: undefined, imported: [] })
  }

  logFeed(feed: OpmlFeed) {
    if (!feed.url) return

    const importedFeed: Feed = {
      id: feed.id,
      type: FEED,
      isLoading: false,
      url: feed.url,
      title: feed.title || feed.url,
      isEditing: false,
      items: [],
      updatedAt: Date.now(),
      customTitle: undefined,
    }

    this.setState((state) => ({ imported: [...state.imported, importedFeed] }))
  }

  fail(message: string) {
    this.setState({
      error: message,
      imported: [],
    })
  }
}

export default connector(ImportForm)
