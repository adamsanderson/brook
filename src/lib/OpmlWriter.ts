export type OpmlExportNode = {
  addFolder: (title: string) => OpmlExportNode
  addFeed: (title: string, url: string) => void
}

export default class OpmlWriter implements OpmlExportNode {
  doc: XMLDocument
  head: HTMLHeadElement
  body: HTMLBodyElement

  constructor(title: string) {
    const impl = document.implementation
    const doc = impl.createDocument("", "opml", null)
    this.doc = doc
    doc.prepend(this.doc.createProcessingInstruction('xml', 'version="1.0" encoding="ISO-8859-1"'))

    this.head = this._createHead(title)
    this.body = this._createBody()
  }

  getRoot() {
    return this.doc.children[0]
  }

  addFolder(title: string) {
    return new OpmlFolder(this.doc, this.body).addFolder(title)
  }

  addFeed(title: string, url: string) {
    return new OpmlFolder(this.doc, this.body).addFeed(title, url)
  }

  _createHead(titleText: string) {
    const head = this.getRoot().appendChild(this.doc.createElement("head"))
    const title = head.appendChild(this.doc.createElement("title"))
    title.appendChild(this.doc.createTextNode(titleText))

    return head
  }

  _createBody() {
    const body = this.getRoot().appendChild(this.doc.createElement("body"))
    return body
  }

  toString() {
    return new XMLSerializer().serializeToString(this.doc)
  }
}

class OpmlFolder implements OpmlExportNode {
  doc: XMLDocument
  root: Element
  
  constructor(doc: XMLDocument, root: Element) {
    this.doc = doc
    this.root = root
  }

  addFolder(title: string) {
    const node = this.doc.createElement("outline")
    node.setAttribute("text", title)
    this.root.appendChild(node)

    return new OpmlFolder(this.doc, node)
  }

  addFeed(title: string, url: string) {
    const node = this.doc.createElement("outline")
    node.setAttribute("text", title)
    node.setAttribute("title", title)
    node.setAttribute("type", "rss")
    node.setAttribute("xmlUrl", url)
    this.root.appendChild(node)
  }
}