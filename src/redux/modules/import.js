export const IMPORT_OPML = "IMPORT_OPML"

export function importOpml(xml) {
  return {
    type: IMPORT_OPML,
    payload: {
      xml
    }
  }
}