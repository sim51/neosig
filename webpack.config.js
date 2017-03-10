var webpack = require('webpack');
var path = require('path');
var argv = require('yargs').argv;
var package = require('./package.json');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var DEBUG = true;
if(process.env.NODE_ENV == 'production')
  DEBUG = false;

// Paths
var basePath = path.resolve(__dirname);
var paths = {
  base: basePath,
  nodeModules: path.join(basePath, 'node_modules'),
  app: path.join(basePath, 'src'),
  index: path.join(basePath, 'src/index.html'),
  build: path.join(basePath, 'docs')
};

var wConfig = {
  entry: {
    neosig: path.join(paths.app, 'js/index')
  },
  output: {
    filename: '[name]-' + package.version + '.js',
    path: paths.build
  },
  module: {
    rules: [
      { test: /\.js$/, loader: 'eslint-loader', include: path.resolve('src') },
      // Enable ES6 support
      { test: /\.js?$/, exclude: [paths.nodeModules], loaders: ['ng-annotate-loader', 'babel-loader'] },
      //load sigma as global
      { test: /.*\/sigma.+\.js$/, loaders: ['script-loader'] }
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  cache: DEBUG,
  devtool: (DEBUG ? '#inline-source-map' : false)
};

if(!DEBUG)
  wConfig.plugins.push(
    new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': process.env.NODE_ENV
    }
    })
  );
if (DEBUG) {
  // Entry points - In production we'll have only the `main.jsx` entry.
  // However in DEBUG, we'll enable Webpacks "Hot Module Replacement"
  // functionality for fast development!
  var entries = {};
  var defaultEntries = ['webpack-dev-server/client?http://localhost:8080', 'webpack/hot/only-dev-server'];
  // Adding default entries
  entries['neosig'] = defaultEntries.concat(wConfig.entry.neosig);
  wConfig.entry = entries;

  // Hot Module Replacement ftw
  wConfig.plugins = wConfig.plugins.concat([
    new webpack.HotModuleReplacementPlugin()
  ]);
  wConfig.devServer = {
    hot: true
  }
}

if (!DEBUG) {
  // Minification and merging in production for small(ish) builds!
  wConfig.plugins = wConfig.plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      comments: false,
      sourceMap: false,
      mangle: true,
      minimize: true
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]);
}

module.exports = wConfig;
