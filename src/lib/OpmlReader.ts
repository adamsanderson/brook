export type OpmlFeed = {
  id: string
  title: string | null
  url: string | null
}

export type OpmlFolder = {
  id: string
  title: string | null
}

export type OpmlReaderHandlers = {
  onFeed?: (feed: OpmlFeed, parentId?: string) => void
  onFolder?: (folder: OpmlFolder, parentId?: string) => void
  onFinish?: () => void
}

export default class OpmlReader {
  private readonly handleFeed?: OpmlReaderHandlers["onFeed"]
  private readonly handleFolder?: OpmlReaderHandlers["onFolder"]
  private readonly handleFinish?: OpmlReaderHandlers["onFinish"]

  constructor(handlers: OpmlReaderHandlers) {
    this.handleFeed = handlers.onFeed
    this.handleFolder = handlers.onFolder
    this.handleFinish = handlers.onFinish
  }

  read(xml: string): void {
    const parser = new DOMParser()
    const doc = parser.parseFromString(xml, "application/xml")
    const root = doc.querySelector("body")

    if (!root) {
      if (this.handleFinish) this.handleFinish()
      return
    }

    this._readChildren(root)
    if (this.handleFinish) this.handleFinish()
  }

  private _readNode(node: Element, parentId?: string): void {
    const id = Math.random().toString(36).substring(2, 15)

    if (node.nodeName === "outline") {
      const title = node.getAttribute("title") || node.getAttribute("text")

      if (node.getAttribute("type") === "rss") {
        const url = node.getAttribute("xmlUrl")
        if (this.handleFeed) this.handleFeed({ id, title, url }, parentId)
      } else {
        if (this.handleFolder) this.handleFolder({ id, title }, parentId)
      }
    }

    this._readChildren(node, id)
  }

  private _readChildren(node: Element, parentId?: string): void {
    const children = node.children
    const len = children.length

    for (let i = 0; i < len; i++) {
      const child = children.item(i)
      if (child) this._readNode(child, parentId)
    }
  }
}
