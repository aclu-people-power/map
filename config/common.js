const path = require('path');
const util = require('./util');
const CopyWebpackPlugin = require('copy-webpack-plugin');

//Directory that webpack should compile assets to
const DIST_PATH = process.env.DIST_PATH || path.resolve(__dirname, '../dist');

//base URL path to where all assets will be hosted
const ASSET_PATH = process.env.ASSET_PATH || '/';

module.exports = function(env){
  return {
    entry: {
      'initialize': './src/initialize.js'
    },
    output: {
      path: DIST_PATH,
      publicPath: ASSET_PATH
    },
    devtool: 'cheap-module-eval-source-map',
    module: {
      rules: [
        //Transpile JS with babel
        //FIXME on node 7+ this currently outputs (harmless) deprecation warning
        //caused by: https://github.com/babel/babel-loader/pull/391
        //Once new babel-loader is release, we should upgrade and remove this comment
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        //Process VUE template files, extracting CSS to seperate files
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            loaders: {
              css:  util.extractTextStyleLoaders('vue-style-loader'),
              scss: util.extractTextStyleLoaders('vue-style-loader'),
            }
          }
        },
        //scss: ['vue-style-loader'].concat(util.styleLoaders)
        //Allows for normal scss files to also be required directly
        {
          test: /\.scss$/,
          use: util.extractTextStyleLoaders('style-loader'),
        },
        //Inline very small font files (less than 5kb), otherwise just copy
        //to output dir as normal files
        {
          test: /\.(eot|ttf|woff|woff2)$/,
          loader: 'url-loader',
          options: {
            limit: 5000,
            name: './fonts/[name]-[hash].[ext]',
          },
        },
        //inline assests smaller than 10kb, otherwise copy them as files to output dir
        {
          test: /\.(jpg|png|svg)$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: './images/[name]-[hash].[ext]'
          },
        },
      ]
    },
    //Setup some basic extensions and aliases to make importing files easier
    //to type and refactor. Note, when importing SCSS or using as src of
    //an image files, you need to prefix the path with the '~' char, E.g.
    //```@import '~styles/variables'```
    //instead of
    //```@import 'styles/variables'```
    resolve: {
      extensions: [".js", ".json", ".vue", ".scss"],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        'src': path.resolve(__dirname, '../src'),
        'assets': path.resolve(__dirname,'../src/assets'),
        'styles': path.resolve(__dirname,'../src/assets/styles'),
        'fonts': path.resolve(__dirname,'../src/assets/fonts'),
        'images': path.resolve(__dirname,'../src/assets/images'),
        'components': path.resolve(__dirname,'../src/components')
      }
    },

		plugins: [
			// new CopyWebpackPlugin([{
			// 	from: './data/us_postal_codes.js',
			// 	to: 'us_postal_codes.js'
			// }])
		]
  }
}
