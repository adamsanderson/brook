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
  console.error(...arguments)

  if (error.unreported) return

  Sentry.withScope(scope => {
    if (info) {
      Object.keys(info).forEach(key => {
        scope.setExtra(key, info[key])
      })
    }
    Sentry.captureException(error)
  })
}