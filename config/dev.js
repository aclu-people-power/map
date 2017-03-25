const webpackMerge = require('webpack-merge');
const commonConfig = require('./common.js');
const webpack = require('webpack');

module.exports = function(env) {
  return webpackMerge(commonConfig(env), {
    stats: 'errors-only',
    devtool: 'cheap-module-eval-source-map',
  })
};
