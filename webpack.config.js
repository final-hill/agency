/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

const path = require('path'),
      webpack = require('webpack');

module.exports = {
  entry: {
    agency: './src/index.ts'
  },
  devtool: 'source-map',
  mode: 'production',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { modules: true }
          }
        ]
      }, {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  plugins: [
    new webpack.WatchIgnorePlugin([
      /css\.d\.ts$/
    ])
  ],
  resolve: {
    extensions: ['.ts', '.css'],
  },
  // https://github.com/riversun/making-library-with-webpack#1-4publish-an-export-default-class-with-the-setting-library-name--class-name
  output: {
    filename: 'index.js',
    library: 'agency',
    //libraryExport: 'default',
    libraryTarget: 'umd',
    globalObject: 'this',
    //umdNamedDefine: true,
    path: path.resolve(__dirname, 'dist'),
  }
};