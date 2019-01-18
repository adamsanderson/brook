export class NetworkError extends Error {
  unreported = true

  constructor(message, url) {
    super(message)

    if (Error.captureStackTrace) Error.captureStackTrace(this, NetworkError)

    this.url = url
  }
}

export class FeedParseError extends Error {
  constructor(message, url) {
    super(message)

    if (Error.captureStackTrace) Error.captureStackTrace(this, FeedParseError)

    this.url = url
  }
}

export class DeadFeedError extends Error {
  unreported = true

  constructor(message, url) {
    super(message)

    if (Error.captureStackTrace) Error.captureStackTrace(this, FeedParseError)

    this.url = url
  }
}