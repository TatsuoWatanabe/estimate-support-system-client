var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');

module.exports = {
  entry: {
    'styles'   : './src/scss/styles.scss',
    'polyfills': './src/webpack/polyfills.webpack.ts',
    'vendor'   : './src/webpack/vendor.webpack.ts',
    'app'      : './src/app/main.ts'
  },

  resolve: {
    extensions: ['.ts', '.js']
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: [
          {
            loader: 'awesome-typescript-loader',
            options: { configFileName: helpers.root('tsconfig.json') }
          } , 'angular2-template-loader'
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]'
      },
      // loader config for angular component styles 
      {
        test: /\.(scss|css)$/,
        exclude: [/src\/scss\/styles.scss/],  // don't include global scss files.
        use: ['raw-loader','sass-loader'], // don't use css-loader for ng2 （unusual）
      },
      // loader config for global css files
      {
        test: /\.scss$/,
        include: [/src\/scss\/styles.scss/], // only for 'scss/styles.scss'
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  },

  plugins: [
    // Workaround for angular/angular#11580
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      helpers.root('./src'), // location of your src
      {} // a map of your routes
    ),

    // The CommonsChunkPlugin identifies the hierarchy among three chunks: app -> vendor -> polyfills.
    // Where Webpack finds that app has shared dependencies with vendor, it removes them from app.
    // It would remove polyfills from vendor if they shared dependencies, which they don't.
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),

    new HtmlWebpackPlugin({
      template: 'src/webpack/index.webpack.html'
    }),

    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
        Hammer: "hammerjs/hammer"
    })

  ]
};
