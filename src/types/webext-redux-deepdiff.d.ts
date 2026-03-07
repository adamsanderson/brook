declare module 'webext-redux/lib/strategies/deepDiff/diff' {
  const deepDiff: (...args: unknown[]) => unknown
  export default deepDiff
}

declare module 'webext-redux/lib/strategies/deepDiff/patch' {
  const patchDeepDiff: (...args: unknown[]) => unknown
  export default patchDeepDiff
}
