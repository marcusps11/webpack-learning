const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HandlebarsPlugin = require('handlebars-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require('fs')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SRC_PATH = path.resolve(__dirname, './src')
const DIST_PATH = path.resolve(__dirname, './dist')
const cssNano = require('cssnano');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var autoprefixer = require('autoprefixer');


// 'css-loader?importLoaders=1?-autoprefixer', 'postcss-loader'
const defaultCopyPath = path.join(SRC_PATH, 'data/data.json');
const copyPath = path.join(SRC_PATH, 'data/new.json');

let config = {
  entry: {
    bundle: './src/app.js',
    styles: './src/styles/index.scss'
  },
  output: {
    path: DIST_PATH,
    filename: '[name].js',
    publicPath: '/',
    hotUpdateChunkFilename: 'hot/hot-update.js',
    hotUpdateMainFilename: 'hot/hot-update.json'
  },
  devtool: 'source-map',
  module: {
    rules: [{
      exclude: /node_modules/,
      test: /\.hbs$/,
      loader: 'handlebars-loader'
    },
    {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          { loader: 'css-loader?sourcemap' },
          { loader: 'postcss-loader',
          options: {
            sourceMap: 'inline'
          }},
          { loader: 'sass-loader?sourcemap' },
        ]
      })
    },
    {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract("css-loader?sourceMap", "postcss-loader")
    },
    {
      exclude: /node_modules/,
      test: /\.js$/,
      use: 'babel-loader'
    },
  ],
},
plugins: [
  new ExtractTextPlugin({
    filename: 'bundle.css',
    allChunks: true
  }),
  new HandlebarsPlugin({
    entry: path.join(SRC_PATH, '/templates/index.hbs'),
    output: path.join(DIST_PATH, 'index.html'),
    partials: [
      path.join(SRC_PATH, 'templates', '**', '*.hbs')
    ],
    data: require('./src/data/data.json' )
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new CopyWebpackPlugin([{
    from: path.resolve(__dirname, './src/assets'),
    to: path.resolve(__dirname, './dist/assets')
  }])

]
}

module.exports = config;