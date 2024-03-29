const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const JavascriptParser = require('webpack/lib/javascript/JavascriptParser');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const packageJSON = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const srcPath = path.join(process.cwd(), 'src');
const outputPath = path.join(process.cwd(), 'dist');
const tmpPath = path.join(process.cwd(), 'tmp');

function processModule(module, options) {
    const includeUMDDir = path.join(tmpPath, module);
    const zetaDir = fs.existsSync(`../${module}`) ? path.resolve(`../${module}/src`) : path.resolve(`node_modules/${module}`);

    function getExportedNames(filename) {
        const parser = new JavascriptParser('module');
        const names = [];
        parser.hooks.export.tap('export', (statement) => {
            if (statement.type === 'ExportNamedDeclaration') {
                names.push(...statement.specifiers.map(v => v.exported.name));
            }
        });
        parser.parse(fs.readFileSync(filename, 'utf8'));
        return names;
    }

    function getExpressionForSubModule(subMobule) {
        return options.subMobuleExpressions[subMobule];
    }

    function transformDeconstructName(subMobule, name) {
        const alias = options.exportNameMappings[`${subMobule}:${name}`];
        if (alias) {
            return `${alias}: ${name}`
        }
        return name;
    }

    if (!fs.existsSync(includeUMDDir)) {
        fs.mkdirSync(includeUMDDir, { recursive: true });
    }
    fs.readdirSync(options.localPath).forEach((filename) => {
        var output = `import zeta from "${module}";`;
        var parser = new JavascriptParser('module');
        var handler = (statement, source) => {
            if (source.startsWith(module + '/')) {
                const subMobule = source.split('/')[1];
                switch (statement.type) {
                    case 'ExportAllDeclaration': {
                        let names = getExportedNames(path.join(zetaDir, `${subMobule}.js`));
                        output += `const { ${names.map(v => transformDeconstructName(subMobule, v)).join(', ')} } = ${getExpressionForSubModule(subMobule)}; export { ${names.join(', ')} };`;
                        break;
                    }
                    case 'ExportNamedDeclaration': {
                        let names = statement.specifiers.map(v => v.local.name);
                        output += `const { ${names.map(v => transformDeconstructName(subMobule, v)).join(', ')} } = ${getExpressionForSubModule(subMobule)}; export { ${names.join(', ')} };`;
                        break;
                    }
                    case 'ImportDeclaration': {
                        output += `const _defaultExport = ${getExpressionForSubModule(subMobule)}; export default _defaultExport;`;
                        break;
                    }
                }
            }
        };
        parser.hooks.import.tap('import', handler);
        parser.hooks.exportImport.tap('import', handler);
        parser.parse(fs.readFileSync(path.join(options.localPath, filename), 'utf8'));
        fs.writeFileSync(path.join(includeUMDDir, filename), output);
    });
    return includeUMDDir;
}

const zetaDOMPath = processModule('zeta-dom', {
    localPath: path.join(srcPath, 'include/zeta-dom'),
    exportNameMappings: {
        'events:ZetaEventContainer': 'EventContainer'
    },
    subMobuleExpressions: {
        cssUtil: 'zeta.css',
        dom: 'zeta.dom',
        domLock: 'zeta.dom',
        observe: 'zeta.dom',
        util: 'zeta.util',
        domUtil: 'zeta.util',
        events: 'zeta',
        tree: 'zeta',
        env: 'zeta',
        index: 'zeta'
    }
});

module.exports = {
    entry: {
        'brew': './src/entry.js',
        'brew.min': './src/entry.js',
        'brew-slim': './src/entry-slim.js',
        'brew-slim.min': './src/entry-slim.js',
    },
    devtool: 'source-map',
    output: {
        path: outputPath,
        filename: '[name].js',
        library: {
            name: {
                commonjs: 'brew-js',
                amd: 'brew-js',
                root: 'brew'
            },
            type: 'umd',
            export: 'default',
            umdNamedDefine: true
        }
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
        new webpack.BannerPlugin({
            banner: `${packageJSON.name} v${packageJSON.version} | (c) ${packageJSON.author} | ${packageJSON.homepage}`
        }),
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: [tmpPath]
        })
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: /\.min\.js$/i,
                extractComments: false,
                terserOptions: {
                    format: {
                        comments: 'some'
                    }
                }
            })
        ]
    },
    resolve: {
        alias: {
            'zeta-dom': zetaDOMPath
        }
    },
    externals: {
        'promise-polyfill': 'promise-polyfill',
        'waterpipe': 'waterpipe',
        'jquery': {
            commonjs: 'jquery',
            commonjs2: 'jquery',
            amd: 'jquery',
            root: 'jQuery'
        },
        'jq-scrollable': 'jq-scrollable',
        'zeta-dom': {
            commonjs: 'zeta-dom',
            commonjs2: 'zeta-dom',
            amd: 'zeta-dom',
            root: 'zeta'
        }
    }
};
