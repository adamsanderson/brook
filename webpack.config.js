/* eslint-disable */

const path = require('path')
const webpack = require('webpack')
const process = require('process')

module.exports = {
  mode: pickMode(process.env["NODE_ENV"]),
  entry: {
    // Each entry declares an entrypoint to be built.
    sidebar: './src/Sidebar/index.js',
    background: './src/background.js',
    popup: './src/Popup/index.js',
    content: './src/content.js'
  },
  output: {
    // This copies each source entry into the extension dist folder named
    // after its entry config key.
    path: path.join(__dirname, 'extension/dist'),
    filename: '[name].js',
  },
  module: {
    // Transpiles all code (except for third party modules)
    rules: [{
      exclude: /node_modules/,
      test: /\.js$/,
      // Babel options are in .babelrc
      use: {
        loader: "babel-loader"
      },
    }],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.join(__dirname, "src"),
      'node_modules',
    ],
  },
  node: {
    Buffer: true // Include Buffer polyfill for feed parsing (feedme)
  },
  plugins: [],
  optimization: {
    splitChunks: {
      name: "shared",
      chunks: "all"
    }
  },
  // Expose source maps
  devtool: 'sourcemap',
}

// Enforces building in either development or production mode.
function pickMode(nodeEnv) {
  if (!nodeEnv) return "development"
  if (nodeEnv === "production") return "production"
  if (nodeEnv === "development") return "development"
  throw `Unknown NODE_ENV: ${nodeEnv}`;
}