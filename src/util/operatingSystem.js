export const MAC = "macos"
export const WINDOWS = "windows"
export const LINUX = "linux"
export const IOS = "ios"
export const ANDROID = "android"
export const UNKNOWN = "unknown"

let os = undefined

// Adapted from: 
// https://stackoverflow.com/questions/38241480/detect-macos-ios-windows-android-and-linux-os-with-js
export function getOperatingSystem() {
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