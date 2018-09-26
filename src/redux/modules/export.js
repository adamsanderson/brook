import folders, { FOLDER } from "./folders"
import OpmlWriter from "../../lib/OpmlWriter"
import { download } from "../../util/download"

export function exportOpml() {
  return function(_dispatch, getState) {
    const state = getState()

    const writer = new OpmlWriter("Brook Export")

    folders.selectors.getTopLevelNodes(state).forEach(child => {
      write(state, writer, child)
    })

    download("brook_export.opml", writer.toString())
  }
}

function write(state, exportNode, item) {
  if (item.type === FOLDER) {
    const folderNode = exportNode.addFolder(item.title)
    folders.selectors.getChildren(state, item).forEach(child => {
      write(state, folderNode, child)
    })
  } else {
    exportNode.addFeed(item.title, item.url)
  }
}