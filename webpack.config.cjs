const { createBaseWebpackConfig, createUMDExternal, createUMDLibraryDefinition, getPaths } = require('@misonou/build-utils');
const paths = getPaths();

module.exports = {
    ...createBaseWebpackConfig({
        remapImports: ['zeta-dom']
    }),
    entry: {
        'brew': './src/entry.js',
        'brew.min': './src/entry.js',
        'brew-slim': './src/entry-slim.js',
        'brew-slim.min': './src/entry-slim.js',
    },
    output: {
        path: paths.dist,
        filename: '[name].js',
        library: createUMDLibraryDefinition('brew-js', 'brew')
    },
    externals: {
        'zeta-dom': createUMDExternal('zeta-dom', 'zeta'),
        'jquery': createUMDExternal('jquery', 'jQuery'),
        'jq-scrollable': 'jq-scrollable',
        'waterpipe': 'waterpipe'
    }
};
