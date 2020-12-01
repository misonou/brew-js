const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const express = require('express');
const server = express();
const basepath = __dirname;

const zetaIncludePath = (function () {
    var realPath = path.resolve(basepath, '../zeta-dom/src');
    return fs.existsSync(realPath) ? realPath : path.resolve(basepath, 'node_modules/zeta-dom');
})();

server.get('**/*.cjs', function (req, res) {
    var realPath = /^\/zeta-dom\/(.+)$/.test(req.path) ? path.join(zetaIncludePath, RegExp.$1) : path.join(basepath, req.path);
    fs.readFile(realPath, function (err, data) {
        console.log('GET', req.path, '->', realPath);
        if (err) {
            res.sendStatus(404);
        } else {
            res.contentType('application/javascript');
            res.send(data.toString().replace(/module\.exports\s*=\s*/g, 'export default '));
        }
    });
});
server.use('/node_modules', express.static('node_modules'));
server.use('/zeta-dom', express.static(zetaIncludePath));
server.get('/src/include/zeta/*', function (req, res) {
    console.log('GET', req.path);
    fs.readFile(path.join(__dirname, req.path), function (err, data) {
        if (err) {
            res.sendStatus(404);
        } else {
            res.contentType(mime.lookup(req.path) || 'application/octet-stream');
            if (req.path.substr(0, 4) === '/src') {
                res.send(data.toString().replace(/from "zeta-dom/g, 'from "/zeta-dom'));
            } else {
                res.send(data);
            }
        }
    });
});
server.use('/src', express.static('src'));
server.use('/dev', express.static('dev'));
server.use('/dist', express.static('dist'));

const port = process.env.PORT || 3000;
server.listen(port);
console.log('Listening on port', port);
