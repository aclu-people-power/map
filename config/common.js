const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

//Directory that webpack should compile assets to
const DIST_PATH = process.env.DIST_PATH || path.resolve(__dirname, '../dist');

//base URL path to where all assets will be hosted
const ASSET_PATH = process.env.ASSET_PATH || '/';

module.exports = function(env){
  console.log("ENV CHECK: ", env !== "production")
  return {
    entry: {
      bundle: './js/index.js',
      'initialize-map': './js/initialize-map.js'
    },
    output: {
      filename: '[name].js',
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
          test: /.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        },
        {
          //Compile sass files, then run through autoprefixer
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  plugins: function(){return [require('autoprefixer')]}
                }
              },
              'sass-loader',
            ]
          })
        },
        //Inline very small font files (less than 5kb), otherwise just save
        //to output dir as normal files
        {
          test: /\.(eot|ttf|woff|woff2)$/,
          loader: 'url-loader',
          options: {
            limit: 5000,
            name: './fonts/[name].[ext]',
          },
        },
        //inline assests smaller than 10kb, otherwise copy them as files to output dir
        {
          test: /\.(jpg|png|svg)$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: './img/[name].[ext]'
          },
        },
      ]
    },
    plugins: [
      new ExtractTextPlugin({
        filename: "styles.css",
        disable: (env === "production")
      }),
    ]
  }
}
