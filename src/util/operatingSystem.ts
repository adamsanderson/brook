export const MAC = "macos" as const
export const WINDOWS = "windows" as const
export const LINUX = "linux" as const
export const IOS = "ios" as const
export const ANDROID = "android" as const
export const UNKNOWN = "unknown" as const

type OperatingSystem = typeof MAC | typeof WINDOWS | typeof LINUX | typeof IOS | typeof ANDROID | typeof UNKNOWN

let os: OperatingSystem | undefined = undefined

// Adapted from: 
// https://stackoverflow.com/questions/38241480/detect-macos-ios-windows-android-and-linux-os-with-js
export function getOperatingSystem(): OperatingSystem {
  if (os) return os
  
  const userAgent = window.navigator.userAgent
  const platform = window.navigator.platform
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K']
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE']
  const iosPlatforms = ['iPhone', 'iPad', 'iPod']
  
  if (macosPlatforms.indexOf(platform) !== -1) {
    os = MAC
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = IOS
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = WINDOWS
  } else if (/Android/.test(userAgent)) {
    os = ANDROID
  } else if (/Linux/.test(platform)) {
    os = LINUX
  } else {
    os = UNKNOWN
  }

  return os
}