export default class OpmlReader {
  constructor(handlers) {
    this.handleFeed = handlers.onFeed
    this.handleFolder = handlers.onFolder
    this.handleFinish = handlers.onFinish
  }

  read(xml) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(xml, "application/xml")
    const root = doc.querySelector("body")

    this._readChildren(root)
    if (this.handleFinish) this.handleFinish()
  }

  _readNode(node, parentId) {
    const id = Math.random().toString(36).substring(2, 15)

    if (node.nodeName === "outline") {
      const title = node.getAttribute("title") || node.getAttribute("text")
      
      if (node.getAttribute("type") === "rss") {
        const url = node.getAttribute("xmlUrl")
        if (this.handleFeed) this.handleFeed({id, title, url}, parentId)
      } else {
        if (this.handleFolder) this.handleFolder({id, title}, parentId)
      }
    }
    
    this._readChildren(node, id)
  }
  
  _readChildren(node, parentId) {
    const children = node.children
    const len = children.length
  
    for (let i = 0; i < len; i++) {
      this._readNode(children[i], parentId)
    }
  }
}