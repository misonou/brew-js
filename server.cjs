const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const express = require('express');
const server = express();
const basepath = __dirname;

const includePath = {
    'zeta-dom': ''
};

function resolveRealPath(reqPath) {
    var s = reqPath.replace('/src/', '/').split('/');
    return includePath[s[1]] ? path.join(includePath[s[1]], ...s.slice(2)) : path.join(basepath, reqPath);
}

for (let i in includePath) {
    var realPath = path.resolve(basepath, `../${i}/src`);
    includePath[i] = fs.existsSync(realPath) ? realPath : path.resolve(basepath, `node_modules/${i}`);
}

function handleInclude(req, res) {
    var realPath = resolveRealPath(req.path);
    fs.readFile(realPath, function (err, data) {
        console.log('GET', req.path, '->', realPath);
        if (err) {
            res.sendStatus(404);
        } else {
            res.contentType(mime.lookup(realPath) || 'application/octet-stream');
            res.send(data.toString().replace(/from "([\w-]+)\/(\w+)"/g, 'from "/$1/src/$2.js"').replace(/module\.exports\s*=\s*/g, 'export default '));
        }
    });
}

server.get('**/include/*.js', handleInclude);
server.get('**/include/**/*.js', handleInclude);
for (let i in includePath) {
    server.use('/' + i + '/src', express.static(includePath[i]));
}
server.use('/node_modules', express.static('node_modules'));
server.use('/src', express.static('src'));
server.use('/dev', express.static('dev'));
server.use('/dist', express.static('dist'));

const port = process.env.PORT || 3000;
server.listen(port);
console.log('Listening on port', port);
