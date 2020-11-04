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
    server.use('/zeta-dom', express.static(peerIncludePath));
} catch (e) {
    server.use('/zeta-dom', express.static('node_modules/zeta-dom'));
}
server.use('/dev', express.static(path.resolve(basepath, 'dev')));
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

const port = process.env.PORT || 3000;
server.listen(port);
console.log('Listening on port', port);
