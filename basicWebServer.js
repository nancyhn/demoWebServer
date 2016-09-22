/**
 * Created by nguyenkhoa on 9/22/16.
 */
'user strict';

const  http = require('http');
const fs = require('fs');
const url = require('url');

const server = http.createServer();
server.on('request', function (req, res) {
   var url_parsed = url.parse(req.url, true);
    console.log(url_parsed.pathname);
    if (req.method === 'GET') {
        handleGETRequest(res, url_parsed);
    }
}).listen(3000);

let handleGETRequest = function(res, url_parsed) {
    let path = url_parsed.pathname;
    switch (path) {
        case "/": //Nếu route đến trang chủ
            res.writeHead(200, {'Content-Type': 'text/html'});
            fs.readdir('.', function(err, files){
                for (var i=0; i < files.length; i++){
                    res.write('<a href="/' + files[i] + '">' + files[i] + '</a></br>');
                }
                res.end();
            });
            break;
        case "/tom":
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(200, 'json content');
            res.write('{"characters": ["Tom", "Jerry"]}');
            res.end();
            break;
        default:
            if (path.includes('.')){
                serveFile(res, path);
            }
            break;
    }
};
function serveFile(res, path) {
    let extension =  path.split('.').pop();
    var contentType;
    switch (extension) {
        case 'js':
            contentType = 'text/javascript';
            break;
        case '.h':
            contentType = 'text/plain';
            break;
        case '.m':
            contentType = 'text/plain';
            break;
        case 'jpg':
            contentType = 'image/jpg';
            break;
        case 'png':
            contentType = 'image/png';
            break;
        default:
            contentType = 'unknown';
            res.end();
            return;
    }
    res.writeHead(200, {'Content-Type': contentType});

    let stream = fs.createReadStream('.' + path);
    stream.on('open', function () {
        // This just pipes the read stream to the response object (which goes to the client)
        stream.pipe(res);
    });

    // This catches any errors that happen while creating the readable stream (usually invalid names)
    stream.on('error', function(err) {
        console.log('Error at: .' + path);
        res.end(err);
    });

}
// var port = 3000;
// let server = http.createServer(function (req, res) {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     fs.readdir('.', function (err, files) {
//        for (var i = 0; i < files.length; i++) {
//            //res.write(files[i] + '<br/>');
//            res.write('<a href="/' + files[i] + '">' + files[i] + '</a></br>');
//        }
//         res.end();
//     });
//
// }).listen(port);
// console.log('Server dang chay tai port', port);