# Brook

Brook is a simple feed reader built to work with webext compatible browsers.  At the moment,
this means Firefox since it's the primary browser I use that supports the sidebar API.

## Development

To start developing, run:

```
yarn install
yarn dev # The plugin will build and launch Firefox by default
```

To see debugging messages in Firefox, use the `Browser Console`.  To debug, use the `Browser Toolbox`, 
or visit `about:debugging` and click the `debug` button.

[web-ext]: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Getting_started_with_web-ext

To access special debugging menus, shift click the primary menu.

## Build and Deploy

See [docs/publishing.md](docs/publishing.md).

## Development Status and Priorities

This project exists primarily to let me read my feeds in Firefox.  I have done my best to make it a pleasant
experience.  I work on this in my odd hours once the family sleeps.

## Assets and Attribution

- The Brook logo was scrawled by Adam Sanderson
- Feed status icons were mangled by Adam Sanderson
- Interface icons are from the [Feather](https://feathericons.com/) icon set.