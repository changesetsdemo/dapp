const { resolve } = require('path');
const merge = require('webpack-merge');
const argv = require('yargs-parser')(process.argv.slice(2));
const _mode = argv.mode || 'development';
const _mergeConfig = require(`./config/webpack.${_mode}.js`);
const _modeflag = _mode === 'production' ? true : false;
const WebpackBar = require('webpackbar');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const { ProvidePlugin } = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const webpackBaseConfig = {
  entry: {
    main: resolve('src/web/index.tsx'),
  },
  output: {
    path: resolve(process.cwd(), 'dist'),
  },
  // cache: {
  //   type: 'filesystem',
  //   // cacheDirectory: resolve(__dirname, '.temp'),
  // },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        // include: '/node_modules/',
        // enforce: 'post',
        use: {
          loader: 'swc-loader',
        },
      },
      //test: /\.(png|woff|woff2|eot|ttf|svg)$/,
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        include: [resolve(__dirname, 'src'), resolve(__dirname, 'node_modules')],
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader',
        ],
      },
      {
        test: /\.(png|jpg|svg)$/,
        type: 'asset',
      },
      {
        resourceQuery: /raw-lingui/,
        type: 'javascript/auto',
      },
    ],
  },
  optimization: {
    runtimeChunk: {
      name: 'runtime',
    },
    splitChunks: {
      chunks: 'all',
      // maxInitialRequests: 3,
      // name: true,
      maxAsyncRequests: 3,
      cacheGroups: {
        commons: {
          chunks: 'all',
          name: 'chunk-common',
          minChunks: 2,
          maxInitialRequests: 5,
          priority: 1,
          enforce: true,
          reuseExistingChunk: true,
        },
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          priority: 2,
          reuseExistingChunk: true,
          enforce: true,
        },
        solvProtocol: {
          name: 'chunk-solv-protocol',
          test: /[\\/]node_modules[\\/]@solv-protocol*\w/,
          chunks: 'all',
          priority: 3,
          reuseExistingChunk: true,
          enforce: true,
        },
        muiComponent: {
          name: 'chunk-solv-components',
          test: /([\\/]node_modules[\\/]@mui[\\/].+\w)|(src[\\/]web[\\/]components[\\/]common)|([\\/]node_modules[\\/]@solv-protocol[\\/]components)/,
          chunks: 'all',
          priority: 4,
          reuseExistingChunk: true,
          enforce: true,
        },
        ethersSDK: {
          name: 'chunk-ethers-sdk',
          test: /[\\/]node_modules[\\/](ethers*\w|@ethersproject*\w|@solver*\w)/,
          // test: module =>
          //   module.resource &&
          //   /.js$/.test(module.resource) &&
          //   module.resource.includes(path.join(__dirname, `../node_modules/${package}/`)),
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true,
          enforce: true,
        },
        reactLibs: {
          name: 'chunk-react-libs',
          test: /[\\/]node_modules[\\/](react|react.+\w)/,
          chunks: 'all',
          priority: 6,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
      // minSize: {
      //   javascript: 0,
      //   style: 0,
      // },
      // maxSize: {
      //   javascript: 500000,
      //   style: 10,
      // },
    },
  },
  resolve: {
    // fallback: { url: false, os: false },
    alias: {
      '@components': resolve('src/web/components'),
      '@hooks': resolve('src/web/hooks'),
      '@pages': resolve('src/web/pages'),
      '@layouts': resolve('src/web/layouts'),
      '@assets': resolve('src/web/assets'),
      '@states': resolve('src/web/states'),
      '@service': resolve('src/web/service'),
      '@utils': resolve('src/web/utils'),
      '@lib': resolve('src/web/lib'),
      '@constants': resolve('src/web/constants'),
      '@connection': resolve('src/web/connection'),
    },
    extensions: ['.js', '.ts', '.tsx', 'jsx', '.css'],
    fallback: {
      // stream: require.resolve('stream-browserify'),
    },
  },
  plugins: [
    new NodePolyfillPlugin(),
    new MiniCssExtractPlugin({
      filename: _modeflag ? 'styles/[name].[contenthash:5].css' : 'styles/[name].css',
      chunkFilename: _modeflag ? 'styles/[name].[contenthash:5].css' : 'styles/[name].css',
      ignoreOrder: false,
    }),
    // new ProvidePlugin({
    //   Buffer: ['buffer', 'Buffer'],
    // }),
    new CleanWebpackPlugin(),
    new WebpackBar(),
    new Dotenv(),
  ],
};
module.exports = merge.default(webpackBaseConfig, _mergeConfig);
