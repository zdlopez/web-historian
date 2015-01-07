var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers.js');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    console.log(req.url);
    if (req.url === '/') {
      getFile('/index.html', res);
    }
    getFile(req.url, res);
  }
  //res.end(archive.paths.list);
};


var getFile = function(filepath, res){
  filepath = archive.paths.siteAssets + filepath;
  console.log(filepath);
  fs.exists(filepath, function (exists){
    if(exists){
      res.writeHead(200, http.headers);
      fs.readFile(filepath, 'utf8', function(err, data){
        if(err){
          console.log(err);
        } else {
          res.end(data);
        }
      })
    } else {
      res.writeHead(404, http.headers);
      res.end();
    }
  });

};


