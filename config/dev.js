const webpackMerge = require('webpack-merge');
const commonConfig = require('./common.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = function(env) {
  return webpackMerge(commonConfig(env), {
    output: {
      filename: '[name].js',
    },
    stats: 'errors-only',
    devtool: 'eval-source-map',
    plugins: [
      new ExtractTextPlugin({
        filename: "bundle.css",
        disable: true
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html.ejs',
        inject: false,
				favicon: './src/assets/favicon.ico'
      })
    ]
  })
};
