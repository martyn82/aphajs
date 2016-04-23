const project = require('./../package.json').config;

module.exports = {
    output: {
        path: './' + project.dist_dir + '/',
        filename: '[name].app.js',
        sourceMapFilename: '[file].map'
    },
    target: 'node',
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '']
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            }
        ]
    }
};
