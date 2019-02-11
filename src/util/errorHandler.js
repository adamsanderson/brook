import * as Sentry from '@sentry/browser'
import ENV from './env'

export function initErrorHandler(){
  Sentry.init({
    dsn: "https://980bd0c5a7754cb4b0c9756ff723aa69@sentry.io/1361967",
    environment: ENV.environmentName,
    release: `brook@${browser.runtime.getManifest().version}`,
    whitelistUrls: [
      /^[\w]+-extension:\//
    ],
    integrations: [
      new Sentry.Integrations.RewriteFrames({
        iteratee: (frame => {
          if (frame.filename) {
            // Clean URLs that include the extension id such as:
            // moz-extension://d1eee302-f36c-7641-9595-cb9e11334238/background.html
            frame.filename = frame.filename.replace(/\/\/[a-f0-9-]+/,"")
          }
          return frame
        })
      })
    ]
   })
}

export function reportError(error, info) {
  const reportable = isReportable(error)
  
  // Treat errors outside the control of Brook as warnings and 
  // do not report them.
  if (!reportable) {
    console.warn(...arguments)
    return false  
  }

  console.error(...arguments, `Reported:`, reportable)

  Sentry.withScope(scope => {
    if (info) {
      Object.keys(info).forEach(key => {
        scope.setExtra(key, info[key])
      })
    }
    Sentry.captureException(error)
  })
}

/**
 * Determines whether a given error should be reported.  We are not interested in issues
 * outside the control of Brook such as HTTP timeouts.
 * 
 * @param {Error} error 
 * @returns {Boolean}
 */
function isReportable(error) {
  // Internal errors may flag themselves as unreported:
  if (error.unreported) return false
  
  // Some common DOMExceptions should not be reported because there is nothing we can
  // do about them.
  if (error instanceof DOMException) {
    switch (error.name) {
      case "NotFoundError":
      case "TimeoutError":
      case "NetworkError":
      case "AbortError":
      case "QuotaExceededError":
        return false
      default:
        return true
    }
  }

  // The fetch API returns a TypeError when there is a network related error. This is ridiculous
  // because it's not a TypeError, it's a network error, but so it goes…
  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Checking_that_the_fetch_was_successful
  if (error instanceof TypeError) {
    return !error.message.match(/\b(NetworkError|fetch)\b/i)
  }

  return true
}