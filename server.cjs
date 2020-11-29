const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const express = require('express');
const server = express();
const basepath = __dirname;

server.use('/node_modules', express.static('node_modules'));
try {
    const peerIncludePath = path.resolve(basepath, '../zeta-dom');
    fs.lstatSync(peerIncludePath);
    server.use('/zeta-dom/dist', express.static(path.join(peerIncludePath, 'dist')));
    server.use('/zeta-dom', express.static(path.join(peerIncludePath, 'src')));
} catch (e) {
    server.use('/zeta-dom', express.static('node_modules/zeta-dom'));
}
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
