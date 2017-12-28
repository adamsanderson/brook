const STATE_KEY = "brook"

export function loadState() {
  try {
    const jsonState = localStorage.getItem(STATE_KEY)
    return jsonState ? JSON.parse(jsonState) : undefined

  } catch (err) {
    console.error("Could not load state", err)
    return undefined
  }
}

export function saveState(state) {
  try {
    const jsonState = JSON.stringify(state)
    localStorage.setItem(STATE_KEY, jsonState)
    
  } catch (err) {
    console.error("Could not save state", err)
  }
}