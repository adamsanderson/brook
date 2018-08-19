const STATE_KEY = "brook"

// Load state from the browser's plugin storage with a fallback to
// localStorage for any plugins in a transitional state.
// 
// Returns a promise.
export function loadState() {
  return loadStateFromExtensionStorage()
    .then(value => {
      return value || loadStateFromLocalStorage()
    })
    .catch(error => {
      console.error("Could not load state", error)
      return undefined
    })
}

// Saves state to the browser's plugin storage.
// Currently we don't try to save state to localstorage
// since it's not reliable across restarts.
export function saveState(state) {
  return saveStateToExtensionStorage(state)
    .catch(error => console.error("Could not save state", error))
}

function loadStateFromLocalStorage() {
  const jsonState = localStorage.getItem(STATE_KEY)
  return jsonState ? JSON.parse(jsonState) : undefined
}

function loadStateFromExtensionStorage() {
  if (!browser.storage && browser.storage.local) return

  return browser.storage.local.get(STATE_KEY)
    .then(payload => payload[STATE_KEY])
}

function saveStateToExtensionStorage(state) {
  if (!browser.storage && browser.storage.local) return
  
  return browser.storage.local.set({
    [STATE_KEY]: state
  })
}