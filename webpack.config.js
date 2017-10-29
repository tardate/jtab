var path = require('path')
var webpack = require('webpack')

module.exports = function (env) {
    return {
        entry: './javascripts/jtab.js',
        output: {
            path: path.resolve(__dirname, './dist'),
            publicPath: '/dist/',
            filename: (typeof env.production != 'undefined')?'jtab.min.js':'jtab.js'
        },
        module: {
            rules: []
        },
        performance: {
            hints: false
        },
        devtool: '#source-map'
    }
}