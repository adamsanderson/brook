export class NetworkError extends Error {
  constructor(message, url) {
    super(message)

    if (Error.captureStackTrace) Error.captureStackTrace(this, NetworkError)

    this.url = url
  }
}

export class FeedParseError extends Error {
  constructor(message, url, body) {
    super(message)

    if (Error.captureStackTrace) Error.captureStackTrace(this, FeedParseError)

    this.url = url
    this.body = body
  }
}