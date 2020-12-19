const fs = require('fs');
const path = require('path');
const JavascriptParser = require('webpack/lib/javascript/JavascriptParser');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const srcPath = path.join(process.cwd(), 'src');
const outputPath = path.join(process.cwd(), 'dist');
const packagePath = path.join(process.cwd(), 'build');

const includeESMDir = path.join(srcPath, 'include/zeta');
const includeUMDDir = path.join(process.cwd(), 'tmp');
const zetaDir = fs.existsSync('../zeta-dom') ? path.resolve('../zeta-dom/src') : path.resolve('node_modules/zeta-dom');

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
    switch (subMobule) {
        case 'cssUtil':
            return 'zeta.css';
        case 'dom':
        case 'domLock':
        case 'observe':
            return 'zeta.dom';
        case 'util':
        case 'domUtil':
            return 'zeta.util';
        case 'events':
        case 'tree':
        case 'env':
            return 'zeta';
    }
}

function transformDeconstructName(subMobule, name) {
    if (subMobule === 'events') {
        switch (name) {
            case 'ZetaEventContainer':
                return 'EventContainer: ZetaEventContainer';
        }
        throw `Export ${name} does not exist in zeta-dom/${subMobule} UMD distribution`
    }
    return name;
}

if (!fs.existsSync(includeUMDDir)) {
    fs.mkdirSync(includeUMDDir);
}
fs.readdirSync(includeESMDir).forEach((filename) => {
    var output = 'import zeta from "zeta-dom";';
    var parser = new JavascriptParser('module');
    var handler = (statement, source) => {
        if (/^zeta-dom\/(.+)/.test(source)) {
            const subMobule = RegExp.$1;
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
                    let defaultSpecifier = statement.specifiers.filter(v => v.type === 'ImportDefaultSpecifier')[0].local.name;
                    output += `const ${defaultSpecifier} = ${getExpressionForSubModule(subMobule)}; export default ${defaultSpecifier};`;
                    break;
                }
            }
        }
    };
    parser.hooks.import.tap('import', handler);
    parser.hooks.exportImport.tap('import', handler);
    parser.parse(fs.readFileSync(path.join(includeESMDir, filename), 'utf8'));
    fs.writeFileSync(path.join(includeUMDDir, filename), output);
});

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
            cleanOnceBeforeBuildPatterns: [`${packagePath}/**/*`],
            cleanAfterEveryBuildPatterns: [includeUMDDir]
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
        alias: {
            'zeta-dom': includeUMDDir
        }
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
        'zeta-dom': {
            commonjs: 'zeta-dom',
            commonjs2: 'zeta-dom',
            amd: 'zeta-dom',
            root: 'zeta'
        }
    }
};
