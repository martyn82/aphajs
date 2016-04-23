const project = require('./../package.json').config;
const webpackConfig = require('./webpack.conf');

module.exports = function (config) {
    config.set({
        basePath: __dirname + '/..',
        frameworks: ['mocha', 'chai', 'sinon'],
        files: [
            {
                pattern: 'config/test.conf.js',
                included: true
            },
            {
                pattern: project.build_dir + '/test/**/*.js',
                included: true
            }
        ],
        exclude: [],
        preprocessors: {
            'config/test.conf.js': ['webpack'],
            '**/test/**/*.js': ['webpack']
        },
        webpack: {
            debug: false,
            resolve: webpackConfig.resolve,
            node: {
                fs: 'empty',
                tls: 'empty',
                net: 'empty'
            },
            module: {
                loaders: webpackConfig.module.loaders,
                postLoaders: [
                    {
                        test: /\.jsx?$/,
                        exclude: /(test|node_modules)/,
                        loader: 'istanbul-instrumenter'
                    }
                ]
            },
            devtool: 'inline-source-map'
        },
        webpackMiddleware: {
            noInfo: true
        },
        reporters: ['spec', 'coverage'],
        coverageReporter: {
            dir: project.test_reports_dir,
            reporters: [
                {
                    type: 'json',
                    subdir: '.',
                    file: 'coverage.json'
                }
            ]
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['PhantomJS'],
        singleRun: true,
        concurrency: Infinity
    });
};
