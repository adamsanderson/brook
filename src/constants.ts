// Position constants
export const BEFORE = -1
export const OVER = 0
export const AFTER = 1

export type PositionType = typeof BEFORE | typeof OVER | typeof AFTER;

// Feed Formats
export const WP_API = 'wordpress-api'
export const WATCH_PAGE = 'watch-page'

export type FeedFormatType = typeof WP_API | typeof WATCH_PAGE