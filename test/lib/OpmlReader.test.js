import fs from "fs/promises"
import OpmlReader from "../../src/lib/OpmlReader"

const FIXTURE_DIR = "test/data/opml/"

describe('Opml Reader', () => {
  // This just verifies that all the example files can be read, though
  // makes no specific assertions about them.  For more detailed tests,
  // see below.
  it("can read all the sample files", async () => {
    const paths = await fs.readdir(FIXTURE_DIR)

    const promises = paths.map(async (path) => {
      const buffer = await fs.readFile(FIXTURE_DIR + path)
      await readOpmlString(buffer.toString())
    })

    await Promise.all(promises)
  })
  
  it("parses the xml url", async () => {
    const url = "example.com/feed.xml"
    const xml = `<outline type="rss" htmlUrl="http://example.com/" xmlUrl="${url}"/>`

    const {feedFn} = await readOpmlTemplate(xml)
    const [feed] = feedFn.mock.calls[0]
    expect(feed.url).toBe(url)
  })

  it("treats entries without type=rss are treated as folders", async () => {
    const xml = `<outline xmlUrl="example.com"/>`

    const {folderFn} = await readOpmlTemplate(xml)
    expect(folderFn).toHaveBeenCalled()
  })

  it("ignores non outline nodes", async () => {
    const xml = `<feed xmlUrl="example.com"/>`

    const {feedFn, folderFn} = await readOpmlTemplate(xml)
    expect(feedFn.mock.calls).toEqual([])
    expect(folderFn.mock.calls).toEqual([])
  })

  it("assigns an id to all feeds", async () => {
    const xml = `<outline type="rss" xmlUrl="example.com"/>`

    const {feedFn} = await readOpmlTemplate(xml)
    const [feed] = feedFn.mock.calls[0]
    expect(feed.id).toBeDefined()
  })


  it("passes a parentId to all children", async () => {
    const xml = `
      <outline type="rss" xmlUrl="parent.com">
        <outline type="rss" xmlUrl="child.com" />
      </outline>
    `

    const {feedFn} = await readOpmlTemplate(xml)
    const [parent] = feedFn.mock.calls[0]
    const [_child, parentId] = feedFn.mock.calls[1]
    expect(parent.id).toEqual(parentId)
  })

  it("is empty when no valid root exists", async () => {
    const xml = `
      <apple>
        <outline type="rss" xmlUrl="child.com" />
      </apple>
    `
    
    const {feedFn} = await readOpmlString(xml)
    expect(feedFn).not.toHaveBeenCalled()
  })

})

function readOpmlTemplate(xmlUnderTest) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <opml version="1.1">
      <body>
        ${xmlUnderTest}
      </body>
    </opml>
  `

  return readOpmlString(xml)
}

function readOpmlString(xml) {  
  const feedFn = vi.fn()
  const folderFn = vi.fn()

  return new Promise((resolve) => {
    new OpmlReader({
      onFeed: feedFn,
      onFolder: folderFn,
      onFinish: () => {
        resolve({feedFn, folderFn})
      }
    }).read(xml)
  })
}
