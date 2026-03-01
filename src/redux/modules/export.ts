import { ThunkAction } from 'redux-thunk'
import folders, { FOLDER } from "./folders"
// @ts-expect-error migration
import OpmlWriter from "../../lib/OpmlWriter"
import { download } from "../../util/download"
import type { RootState, Feed, Folder } from '../types'

type ExportThunk<T = void> = ThunkAction<T, RootState, unknown, never>

export function exportOpml(): ExportThunk {
  return function(_dispatch, getState) {
    const state = getState()

    const writer = new OpmlWriter("Brook Export")

    folders.selectors.getTopLevelNodes(state).forEach(child => {
      write(state, writer, child)
    })

    download("brook_export.opml", writer.toString())
  }
}

function write(state: RootState, exportNode: any, item: Feed | Folder): void {
  if (item.type === FOLDER) {
    const folderNode = exportNode.addFolder(item.title)
    folders.selectors.getChildren(state, item as Folder).forEach(child => {
      write(state, folderNode, child)
    })
  } else {
    exportNode.addFeed(item.title, item.url)
  }
}