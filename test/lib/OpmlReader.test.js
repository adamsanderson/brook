import fs from "fs"
import OpmlReader from "../../src/lib/OpmlReader"

const FIXTURE_DIR = "test/data/opml/"

describe('Opml Reader', () => {
  // This just verifies that all the example files can be read, though
  // makes no specific assertions about them.  For more detailed tests,
  // see below.
  it("can read all the sample files", (done) => {
    fs.readdir(FIXTURE_DIR, (err, paths) => {
      expect(err).toBeFalsy()

      const promises = paths.map((path) => {
        return new Promise((resolve, reject) => {
          fs.readFile(FIXTURE_DIR + path, (err, buffer) => {
            expect(err).toBeFalsy()
            readOpmlString(buffer.toString(), () => {
              resolve()
            })
          })
        })
      })

      Promise.all(promises).then(() => done())
    })
  })
  
  it("parses the xml url", (done) => {
    const url = "example.com/feed.xml"
    const xml = `<outline type="rss" htmlUrl="http://example.com/" xmlUrl="${url}"/>`

    readOpmlTemplate(xml, ({feedFn}) => {
      const [feed] = feedFn.mock.calls[0]
      expect(feed.url).toBe(url)
      done()
    })
  })

  it("treats entries without type=rss are treated as folders", (done) => {
    const xml = `<outline xmlUrl="example.com"/>`

    readOpmlTemplate(xml, ({folderFn}) => {
      expect(folderFn).toBeCalled()
      done()
    })
  })

  it("ignores non outline nodes", (done) => {
    const xml = `<feed xmlUrl="example.com"/>`

    readOpmlTemplate(xml, ({feedFn, folderFn}) => {
      expect(feedFn.mock.calls).toEqual([])
      expect(folderFn.mock.calls).toEqual([])
      done()
    })
  })

  it("assigns an id to all feeds", (done) => {
    const xml = `<outline type="rss" xmlUrl="example.com"/>`

    readOpmlTemplate(xml, ({feedFn}) => {
      const [feed] = feedFn.mock.calls[0]
      expect(feed.id).toBeDefined()
      done()
    })
  })


  it("passes a parentId to all children", (done) => {
    const xml = `
      <outline type="rss" xmlUrl="parent.com">
        <outline type="rss" xmlUrl="child.com" />
      </outline>
    `

    readOpmlTemplate(xml, ({feedFn}) => {
      const [parent] = feedFn.mock.calls[0]
      const [_child, parentId] = feedFn.mock.calls[1]
      expect(parent.id).toEqual(parentId)
      done()
    })
  })

  it("is empty when no valid root exists", (done) => {
    const xml = `
      <apple>
        <outline type="rss" xmlUrl="child.com" />
      </apple>
    `
    
    readOpmlString(xml, ({feedFn}) => {
      expect(feedFn).not.toBeCalled()
      done()
    })
  })

})

function readOpmlTemplate(xmlUnderTest, callback) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <opml version="1.1">
      <body>
        ${xmlUnderTest}
      </body>
    </opml>
  `

  readOpmlString(xml, callback)
}

function readOpmlString(xml, callback) {  
  const feedFn = jest.fn()
  const folderFn = jest.fn()

  new OpmlReader({
    onFeed: feedFn,
    onFolder: folderFn,
    onFinish: () => {
      callback({feedFn, folderFn})
    }
  }).read(xml)
}
