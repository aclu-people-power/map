const webpackMerge = require('webpack-merge');
const commonConfig = require('./common.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = function(env){
  return webpackMerge(commonConfig(env), {
    output: {
      filename: 'bundle.[chunkhash].js'
    },
    devtool: 'source-map',
    plugins: [
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        mangle: {
          screw_ie8: true,
          keep_fnames: true
        },
        compress: {
          screw_ie8: true,
          warnings: false
        },
        comments: false
      }),
      new ExtractTextPlugin({
        filename: "bundle.[contenthash].css",
        disable: false
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html',
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        }
      })
    ]
  })
}
