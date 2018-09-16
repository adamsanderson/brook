import { addFeed, fetchAll } from "./feeds"
import { addFolder } from "./folders"
import OpmlReader from "../../lib/OpmlReader"

export function importOpml(xml) {
  return function(dispatch, _getState) {
    const reader = new OpmlReader({
      onFeed: (feed, parentId) => dispatch(addFeed(feed, { parentId })),
      onFolder: (folder, parentId) => dispatch(addFolder(folder, { parentId })),
      onFinish: () => dispatch(fetchAll()),
    })

    reader.read(xml)
  }
}