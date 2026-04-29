import { defineConfig } from "vite"
import webExtension from "vite-plugin-web-extension"
import { nodePolyfills } from "vite-plugin-node-polyfills"
import viteTsconfigPaths from 'vite-tsconfig-paths'

const target = process.env.TARGET ?? "firefox"
const isChrome = target === "chrome"

export default defineConfig(({ mode }) => {

  return ({
    plugins: [
      // React plugin appears to conflict with `webExtension`
      // react(),
      webExtension({
        manifest: isChrome ? "src/manifest.chrome.json" : "src/manifest.firefox.json",
        browser: target,
        additionalInputs: [
          "src/Import/index.html",
          "src/Popup/index.html",
          "src/SubscribePopup/index.html",
        ],
        webExtConfig: {
          target: isChrome ? "chromium" : "firefox-desktop",
          devtools: true,
          startUrl: isChrome ? "chrome://extensions" : "about:debugging#/runtime/this-firefox",
        },
      }),
      nodePolyfills({
        // Enable polyfills for specific globals and modules
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
        // Enable polyfill for specific modules
        protocolImports: true,
      }),
      viteTsconfigPaths()
    ],
    define: {
      __BROWSER__: JSON.stringify(target),
    },
    optimizeDeps: {
      include: ["react", "react-dom", "redux", "react-redux", "feedme"],
    },
  })
})