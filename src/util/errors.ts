export class NetworkError extends Error {
  unreported = true
  url: string

  constructor(message: string, url: string) {
    super(message)

    if (Error.captureStackTrace) Error.captureStackTrace(this, NetworkError)

    this.url = url
  }
}

export class FeedParseError extends Error {
  url: string

  constructor(message: string, url: string) {
    super(message)

    if (Error.captureStackTrace) Error.captureStackTrace(this, FeedParseError)

    this.url = url
  }
}

export class DeadFeedError extends Error {
  unreported = true
  url: string

  constructor(message: string, url: string) {
    super(message)

    if (Error.captureStackTrace) Error.captureStackTrace(this, DeadFeedError)

    this.url = url
  }
}