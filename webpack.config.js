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
console.log(path.join(__dirname, './src/data/marcus.json' ))

// 'css-loader?importLoaders=1?-autoprefixer', 'postcss-loader'
const defaultCopyPath = path.join(SRC_PATH, 'data/data.json');
const copyPath = path.join(SRC_PATH, 'data/new.json');

const entry = [path.resolve(__dirname, 'src/app.js'), path.resolve(__dirname, 'src/styles/index.scss')]

let config = {
  entry: entry,
  output: {
    filename: 'bundle.js',
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
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
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        use: ['css-loader?importLoaders=1', 'postcss-loader']
      }),
    },
    {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract(['css-loader?sourceMap!sass-loader?outputStyle=expanded&sourceMap=true&sourceMapContents=true',"postcss-loader"])
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
    data: path.join(__dirname, './src/data/marcus.json' )
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