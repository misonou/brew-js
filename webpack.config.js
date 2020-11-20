const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: {
        'brew': './src/index.js',
        'brew.min': './src/index.js',
    },
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: 'brew',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: /\.min\.js$/i
            })
        ]
    },
    resolve: {
        modules: ['..', 'node_modules']
    },
    externals: {
        'promise-polyfill': 'promise-polyfill',
        'waterpipe': 'waterpipe',
        'jquery': 'jQuery',
        'historyjs/scripts/bundled-uncompressed/html5/jquery.history.js': {
            commonjs: 'historyjs',
            commonjs2: 'historyjs',
            amd: 'historyjs',
            root: 'History'
        },
        'zeta-dom/src/index.js': {
            commonjs: 'zeta-dom',
            commonjs2: 'zeta-dom',
            amd: 'zeta-dom',
            root: 'zeta'
        },
        'zeta-dom/src/shim.js': {
            commonjs: ['zeta-dom', 'shim'],
            commonjs2:  ['zeta-dom', 'shim'],
            amd: ['zeta-dom', 'shim'],
            root:  ['zeta', 'shim']
        },
        'zeta-dom/src/util.js': {
            commonjs: ['zeta-dom', 'util'],
            commonjs2:  ['zeta-dom', 'util'],
            amd: ['zeta-dom', 'util'],
            root:  ['zeta', 'util']
        },
        'zeta-dom/src/domUtil.js': {
            commonjs: ['zeta-dom', 'util'],
            commonjs2:  ['zeta-dom', 'util'],
            amd: ['zeta-dom', 'util'],
            root:  ['zeta', 'util']
        },
        'zeta-dom/src/cssUtil.js': {
            commonjs: ['zeta-dom', 'css'],
            commonjs2:  ['zeta-dom', 'css'],
            amd: ['zeta-dom', 'css'],
            root:  ['zeta', 'css']
        },
        'zeta-dom/src/tree.js': {
            commonjs: ['zeta-dom'],
            commonjs2:  ['zeta-dom'],
            amd: ['zeta-dom'],
            root:  ['zeta']
        },
        'zeta-dom/src/dom.js': {
            commonjs: ['zeta-dom', 'dom'],
            commonjs2:  ['zeta-dom', 'dom'],
            amd: ['zeta-dom', 'dom'],
            root:  ['zeta', 'dom']
        }
    }
};
