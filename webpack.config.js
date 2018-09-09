/* eslint-disable */

const path = require('path')
const webpack = require('webpack')
const process = require('process')

module.exports = {
  entry: {
    // Each entry in here would declare a file that needs to be transpiled
    // and included in the extension source.
    // For example, you could add a background script like:
    // background: './src/background.js',
    sidebar: './src/Sidebar/index.js',
    background: './src/background.js',
    content: './src/content.js'
  },
  output: {
    // This copies each source entry into the extension dist folder named
    // after its entry config key.
    path: path.join(__dirname, 'extension/dist'),
    filename: '[name].js',
  },
  module: {
    // This transpiles all code (except for third party modules) using Babel.
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
    // This allows you to import modules just like you would in a NodeJS app.
    extensions: ['.js', '.jsx'],
    modules: [
      path.join(__dirname, "src"),
      'node_modules',
    ],
  },
  node: {
    // Expose `__filename`
    __filename: true,
    Buffer: true
  },
  plugins: [
    // Since some NodeJS modules expect to be running in Node, it is helpful
    // to set this environment var to avoid reference errors.
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || "development"),
    }),
  ],
  optimization: {
    splitChunks: {
      name: "shared",
      chunks: "all"
    }
  },
  // This will expose source map files so that errors will point to your
  // original source files instead of the transpiled files.
  devtool: 'sourcemap',
}
