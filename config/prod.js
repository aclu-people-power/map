const webpackMerge = require('webpack-merge');
const commonConfig = require('./common.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = function(env){
  return webpackMerge(commonConfig(env), {
    output: {
      filename: '[name].[chunkhash].js'
    },
    devtool: 'source-map',
    // Uglify is blowing up trying to further minify mapbox-gl
    // so for now just do not parse it -- it is already minified.
    // https://github.com/mapbox/mapbox-gl-js/issues/4359
    module: {
      noParse: /(mapbox-gl)\.js$/,
    },
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
        template: './src/index.html.ejs',
        inject: false,
        favicon: './src/assets/favicon.ico',
        hash: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        }
      })
    ]
  })
}
