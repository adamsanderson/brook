import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { addFeed, fetchAll } from '../redux/modules/feeds'
import { addFolder } from '../redux/modules/folders'

import OpmlReader from '../lib/OpmlReader'
import FileButton from '../components/FileButton'
import Feed from '../components/Feed'
import { ImportImage } from '../components/images'
import brookImageSrc from '../images/Brook.svg'

class ImportModal extends React.Component {
  static propTypes = {
    addFeed: PropTypes.func.isRequired,
    addFolder: PropTypes.func.isRequired,
    fetchAll: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      error: undefined,
      imported: [],
    }

    this.handleFile = this.handleFile.bind(this)
  }

  render() {
    return (
      <div>
        <h2>
          <img src={brookImageSrc} className='Icon'/>
          Import Feeds
        </h2>

        <form>
          {this.state.imported.length === 0 && (
            <React.Fragment>
              <p>
                Import a feed list from other readers or services.
              </p>
              <p>
                <FileButton onChange={this.handleFile} accept=".opml">
                  Select OPML File
                </FileButton>
              </p>
            </React.Fragment>
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
            {this.state.imported.map(feed => (
              <Feed className="List-item" key={feed.id} feed={feed}/>
            ))}
          </div>
        </form>

        <ImportImage className='layout-trailing' />
      </div>
    )
  }

  handleFile(event) {
    const files = event.target.files
    if (!files.length) return

    const file = files[0]

    if (file.type && !file.type.startsWith("text/")) {
      this.failWithInvalid()
    }

    this.importFile(file)
  }
  
  // This could be extracted, though at the moment it mixes state (feeds imported)
  // and action dispatching.  Should Brook need to implement a more nuanced import
  // we should revisit this separation of concerns.
  importFile(file) {
    const {addFeed, addFolder, fetchAll} = this.props

    const reader = new FileReader()
    reader.onerror = event => this.fail("Could not read file")
    reader.onload = event => {
      this.resetState()
      const text = event.target.result

      const opmlReader = new OpmlReader({
        onFeed: (feed, parentId) => {
          addFeed(feed, { parentId })
          this.logFeed(feed)
        },
        onFolder: (folder, parentId) => {
          addFolder(folder, { parentId })
        },
        onFinish: () => {
          fetchAll()
          if (this.state.imported.length === 0) {
            this.fail("File does not appear to contain feeds")
          }
        },
      })

      opmlReader.read(text)
    }

    reader.readAsText(file)
  }

  resetState() {
    this.setState({error: undefined, imported: []})
  }

  logFeed(feed) {
    const imported = this.state.imported
    this.setState({imported: imported.concat([feed])})
  }

  fail(message) {
    this.setState({
      error: message,
      imported: [],
    })
  }
}

const mapStateToProps = (state, props) => ({
  // state...
})

export default connect(mapStateToProps, {
  addFeed,
  addFolder,
  fetchAll,
})(ImportModal)