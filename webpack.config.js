const config = require("./src/config");
const path = require('path');

var webpackConfig = {
    entry: {main: ["./index.js"]},
    output: {
        path: path.resolve(__dirname, 'dist'), // Output directory
        filename: "main.bundle.js",
        publicPath: "/assets/"
    },
    mode: config.isProd ? "production" : "development",
};

module.exports = webpackConfig;