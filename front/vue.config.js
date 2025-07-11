const path = require('path');

module.exports = {
    outputDir: path.resolve(__dirname, '../back/public'),

    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:5000'
            }
        }
    },

    transpileDependencies: [
        'vuetify'
    ],

    configureWebpack: {
        devtool: 'source-map'
    }
}
