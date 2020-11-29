const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const outputPath = path.join(process.cwd(), 'dist');
const packagePath = path.join(process.cwd(), 'build');

module.exports = {
    entry: {
        'brew': './src/index.js',
        'brew.min': './src/index.js',
    },
    devtool: 'source-map',
    output: {
        path: outputPath,
        filename: '[name].js',
        library: 'brew',
        libraryTarget: 'umd',
        libraryExport: 'default',
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
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [`${packagePath}/**/*`]
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'src',
                    to: `${packagePath}`
                },
                {
                    from: 'dist',
                    to: `${packagePath}/dist`
                },
                {
                    from: 'README.md',
                    to: `${packagePath}`,
                },
                {
                    from: 'package.json',
                    to: `${packagePath}`,
                    transform: function (content) {
                        var packageJSON = JSON.parse(content);
                        packageJSON.main = 'index.js';
                        packageJSON.types = 'index.d.ts';
                        return JSON.stringify(packageJSON, null, 2);
                    }
                }
            ]
        })
    ],
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
        'zeta-dom/index.js': {
            commonjs: 'zeta-dom',
            commonjs2: 'zeta-dom',
            amd: 'zeta-dom',
            root: 'zeta'
        },
        'zeta-dom/shim.js': {
            commonjs: ['zeta-dom', 'shim'],
            commonjs2: ['zeta-dom', 'shim'],
            amd: ['zeta-dom', 'shim'],
            root: ['zeta', 'shim']
        },
        'zeta-dom/util.js': {
            commonjs: ['zeta-dom', 'util'],
            commonjs2: ['zeta-dom', 'util'],
            amd: ['zeta-dom', 'util'],
            root: ['zeta', 'util']
        },
        'zeta-dom/domUtil.js': {
            commonjs: ['zeta-dom', 'util'],
            commonjs2: ['zeta-dom', 'util'],
            amd: ['zeta-dom', 'util'],
            root: ['zeta', 'util']
        },
        'zeta-dom/cssUtil.js': {
            commonjs: ['zeta-dom', 'css'],
            commonjs2: ['zeta-dom', 'css'],
            amd: ['zeta-dom', 'css'],
            root: ['zeta', 'css']
        },
        'zeta-dom/tree.js': {
            commonjs: ['zeta-dom'],
            commonjs2: ['zeta-dom'],
            amd: ['zeta-dom'],
            root: ['zeta']
        },
        'zeta-dom/dom.js': {
            commonjs: ['zeta-dom', 'dom'],
            commonjs2: ['zeta-dom', 'dom'],
            amd: ['zeta-dom', 'dom'],
            root: ['zeta', 'dom']
        }
    }
};
