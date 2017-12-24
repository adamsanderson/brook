import feeds, { addFeed } from './feeds'
import folders, { addFolder } from './folders'
import OpmlReader from '../../lib/OpmlReader'

export const IMPORT_OPML = "IMPORT_OPML"

export function importOpml(xml) {
  return {
    type: IMPORT_OPML,
    payload: {
      xml
    }
  }
}