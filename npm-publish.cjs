const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');

(async function () {
    const dst = path.resolve(__dirname, 'build');
    const packageJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), { encoding: 'utf8' }));

    console.log('Execute npm publish');
    await util.promisify(exec)('npm publish' + (/-(alpha|beta)/.test(packageJSON.version) ? ' --tag beta' : ''), { cwd: dst });
})();
