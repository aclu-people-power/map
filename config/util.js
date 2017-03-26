const ExtractTextPlugin = require('extract-text-webpack-plugin');

let cssLoaders = [
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      plugins: function(){return [require('autoprefixer')]}
    }
  },
  'sass-loader',
]

exports.extractTextStyleLoaders = function(fallback){
  return ExtractTextPlugin.extract({
    fallback: fallback,
    use: cssLoaders,
  })
}
