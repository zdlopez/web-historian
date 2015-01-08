var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers.js');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    console.log(req.url);
    if (req.url === '/') {
      getFile('/index.html', res, 200);
    }
    getFile(req.url, res, 200);
  }

  if (req.method === 'POST') {
    var data = '';
    req.on('data', function(chunk) {
      data += chunk;
    });
    req.on('end', function() {
      console.log("data in post method : ", data);
      postFile(data.slice(data.indexOf('=') + 1), res);
    });
  }
  //res.end(archive.paths.list);
};


var getFile = function(filepath, res, code, flag){
  if (!flag) {
    filepath = archive.paths.siteAssets + filepath;
  }
  console.log(filepath);
  fs.exists(filepath, function (exists){
    if(exists){
      res.writeHead(code, http.headers);
      fs.readFile(filepath, 'utf8', function(err, data){
        if(err){
          console.log(err);
        } else {
          res.end(data);
        }
      });
    } else {
      res.writeHead(404, http.headers);
      res.end();
    }
  });

};

var postFile = function(data, res) {

  console.log("data in post is : ", data);
  fs.appendFile(archive.paths.list, data + "\n", function(err) {
    if (err) {
      console.log(err);
    }
    console.log('data saved');
    console.log(archive.isURLArchived(data));
    if (archive.isURLArchived(data)) {
      var pathname = path.resolve(__dirname, '../archives/sites/');
      getFile(pathname + "/" + data, res, 302, true);
    } else {
      getFile('/loading.html', res, 302);
    }
  });
};


