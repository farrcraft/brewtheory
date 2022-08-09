/**
 * Webpack config for development electron main process
 */

import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import CopyPlugin from 'copy-webpack-plugin';
import baseConfig from '../webpack.config.base';
import webpackPaths from '../webpack.paths';
import checkNodeEnv from '../../scripts/check-node-env';

checkNodeEnv('development');

const configuration: webpack.Configuration = {
  devtool: 'source-map',

  mode: 'development',

  target: 'electron-main',

  entry: {
    main: path.join(webpackPaths.srcMainPath, 'main.ts'),
  },

  output: {
    path: webpackPaths.distDevPath,
    filename: 'main.dev.js',
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },

  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.ANALYZE === 'true' ? 'server' : 'disabled',
    }),

    new CopyPlugin({
      patterns: [
        {
          from: path.join(webpackPaths.srcPath, 'app.html'),
          to: path.join(webpackPaths.distDevPath, 'app.html'),
        },
        {
          from: path.join(webpackPaths.srcPath, 'app.js'),
          to: path.join(webpackPaths.distDevPath, 'app.js'),
        },
      ],
    }),

    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     */
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      DEBUG_PROD: false,
      START_MINIMIZED: false,
    }),
  ],

  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
  node: {
    __dirname: false,
    __filename: false,
  },
};

export default merge(baseConfig, configuration);
