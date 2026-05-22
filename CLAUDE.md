# Brook

A browser extension RSS/Atom feed reader, supporting Chrome and Firefox. Built with React, Redux, and Vite.

## Entry points

- **`src/background/index.ts`** — service worker; owns the real Redux store, runs all feed fetching, handles browser events (tabs, alarms, action clicks)
- **`src/Sidebar/`** — the main feed reader UI, rendered in the browser's side panel
- **`src/SubscribePopup/`** — a small popup that appears when the browser action is clicked on a page with discoverable feeds
- **`src/content.ts`** — injected into tabs; discovers feeds on the active page and dispatches to the background via `dispatchChannel`

Builds target Chrome and Firefox separately: `TARGET=chrome|firefox vite build`.

## State management

Uses **webext-redux** to share a single Redux store across extension contexts.

- **Background** creates `createBackgroundStore()` — the real store with all middleware
- **UI contexts** create `createProxyStore()` — a proxy that syncs via `browser.runtime` message passing using a deep-diff strategy
- `sharedMiddleware` (`[thunk, timeoutScheduler]`) is applied to both stores
- Background-only middleware: `notifications`, `backgroundActions` (alias middleware)

### Redux module pattern

Each module exports `{ name, reducer, selectors, serialize }` and is registered via `addModule()` in `store.ts`. Modules with `serialize: true` have their state persisted to `browser.storage.local` (throttled at 1s). This is a hand-rolled ducks pattern.

### Reducer composition (outermost → innermost)

```
resetableReducer        RESET_DATA wipes state back to initialState
  checkpointableReducer   undo/rollback support (see below)
    persistedReducer        hydrates from browser.storage on startup
      combineReducers         all module reducers
```

### Background alias middleware (`backgroundActions.ts`)

Uses webext-redux's `alias()` to intercept actions dispatched from UI contexts and run them on the background side:

- **`FETCH_ALL`** — spawns 8 concurrent worker slots pulling from a feed queue; skips feeds that are already unread (except the currently selected one)
- **`FETCH_FEED`** — dispatches `loadFeed` (sets `isLoading: true`), then calls `handleFetch`

`handleFetch` performs the actual HTTP request. `updateFeed` always clears `isLoading: false`. Three feed formats are supported:
- **RSS/Atom** — parsed with FeedMe (SAX-style); parser runs in an explicit `Promise` so errors `reject()` correctly rather than throwing into an event handler void
- **`WP_API`** — fetches from the WordPress REST API (`/wp-json/wp/v2/posts`)
- **`WATCH_PAGE`** — fetches the page, extracts main content with Defuddle + linkedom, stores a SHA-256 digest; only flags as updated when content actually changes

Fetching uses ETags and `If-Modified-Since` for conditional requests. 304 responses dispatch an empty `updateFeed` to clear `isLoading`.

### Cross-slice action handling

Modules import action type strings from each other to react to foreign actions. `views` reacts to `SELECT_FEED` and `SELECT_ITEM` from `ui`, and `REMOVE_FEED` from `feeds`. See `scratch/rtk-exploration.md` for notes on how this would look with RTK's `extraReducers`.

## Checkpoint / undo

Actions tagged with `meta: { checkpoint: "label" }` cause `checkpointableReducer` to snapshot the current state. `rollback()` restores it. The UI surfaces this as a toast with an undo action after destructive operations (deleting a feed, renaming, etc.).

## Feed polling

`browser.alarms` fires `fetchFeeds` every 15 minutes, dispatching `fetchAll()` if the browser is online. Also triggered when the user opens the sidebar.

## Tests

Minimal. Don't rely on test coverage to verify behaviour — test the UI directly.

## Maintenance

As features are added or code is refactored, make minimal edits to update the CLAUDE.md file to stay in sync.