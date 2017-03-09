var webpack = require('webpack');
var path = require('path');
var argv = require('yargs').argv;
var package = require('./package.json');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var DEBUG = !argv.release;

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
      { test: /.*\/sigma.+\.js$/, loaders: ['script-loader'] },
      // CSS and LESS support here :)
      { test: /\.css$/, loaders: [ 'style-loader', 'css-loader' ] },
      { test: /\.less$/, loaders: [ 'style-loader', 'css-loader', 'less-loader' ] },
      { test: /\.json$/,  loader: 'json-loader' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,    loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,   loader: "file-loader" }
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
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]);
}

module.exports = wConfig;
