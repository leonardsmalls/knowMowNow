const config = require("./src/config");
const path = require('path');

var webpackConfig = {
    entry: {main: ["./src/index.js"]},
    output: {
        path: path.resolve(__dirname, 'dist'), // Output directory
        filename: "main.bundle.js",
        publicPath: "/assets/"
    },
    mode: config.isProd ? "production" : "development",
    module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
            },
          },
          // Add other loaders as needed
        ],
      },
      resolve: {
        extensions: ['.js', '.jsx'],
        fallback: {
          "crypto": require.resolve("crypto-browserify"),
          "stream": require.resolve("stream-browserify"),
          "https": require.resolve("https-browserify"),
          "os": require.resolve("os-browserify/browser"),
          "path": require.resolve("path-browserify"),
          "querystring": require.resolve("querystring-es3"),
          "url": require.resolve("url/"),
          "buffer": require.resolve("buffer/"),
          "assert": require.resolve("assert/"),
          "timers": require.resolve("timers-browserify"),
          "fs": false,
          "child_process": false,
          "net": false,
          "tls": false,
          "zlib": require.resolve("zlib-browserify"),
          "string_decoder": require.resolve("string_decoder/"),
          "http": require.resolve("stream-http"),
          "vm": require.resolve("vm-browserify"),
        },
      }
};

module.exports = webpackConfig;