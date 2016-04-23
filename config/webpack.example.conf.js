const project = require('./../package.json').config;
const webpackConfig = require('./webpack.conf');

module.exports = {
    entry: {
        example: './examples/example.ts'
    },
    target: 'node',
    output: webpackConfig.output,
    devtool: webpackConfig.devtool,
    resolve: webpackConfig.resolve,
    module: webpackConfig.module
};
