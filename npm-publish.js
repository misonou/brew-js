const { exec } = require('child_process');
const { ncp } = require('ncp');
const fs = require('fs');
const path = require('path');
const util = require('util');

(async function () {
    const dst = path.resolve(__dirname, 'build');

    console.log('Copying assets');
    if (fs.existsSync(dst)) {
        fs.readdirSync(dst).forEach(function (v) {
            var filename = path.join(dst, v);
            if (fs.lstatSync(filename).isDirectory()) {
                fs.rmdirSync(filename, { recursive: true });
            } else {
                fs.unlinkSync(filename);
            }
        });
    } else {
        fs.mkdirSync(dst);
    }
    var packageJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), { encoding: 'utf8' }));
    packageJSON.main = 'index.js';
    packageJSON.types = 'index.d.ts';
    fs.writeFileSync(path.join(dst, 'package.json'), JSON.stringify(packageJSON, null, 2));

    fs.copyFileSync(path.resolve(__dirname, 'README.md'), path.join(dst, 'README.md'));
    await util.promisify(ncp)(path.resolve(__dirname, 'src'), dst);
    await util.promisify(ncp)(path.resolve(__dirname, 'dist'), path.join(dst, 'dist'));

    console.log('Execute npm publish');
    await util.promisify(exec)('npm publish' + (/-(alpha|beta)/.test(packageJSON.version) ? ' --tag beta' : ''), { cwd: dst });
})();
