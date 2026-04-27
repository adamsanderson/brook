import { defineConfig } from "vite"
import webExtension from "vite-plugin-web-extension"
import { nodePolyfills } from "vite-plugin-node-polyfills"
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {

  return ({
    plugins: [
      // React plugin appears to conflict with `webExtension`
      // react(),
      webExtension({
        manifest: "src/manifest.firefox.json",
        additionalInputs: [
          "src/Import/index.html",
          "src/Popup/index.html",
          "src/SubscribePopup/index.html",
        ],
        webExtConfig: {
          target: "firefox-desktop",
          devtools: true,
          startUrl: "about:debugging#/runtime/this-firefox",
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
    optimizeDeps: {
      include: ["react", "react-dom", "redux", "react-redux", "feedme"],
    },
  })
})