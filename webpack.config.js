var path = require('path')
var webpack = require('webpack')

module.exports = {
    entry: './javascripts/jtab.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'jtab.min.js'
    },
    module: {
        rules: []
    },
    performance: {
        hints: false
    },
    devtool: '#source-map'
}
