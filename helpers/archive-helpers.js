var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var $ = require('jquery');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.Urls = [];
exports.readListOfUrls = function(){
  console.log("before sync");
  var data = fs.readFileSync(this.paths.list, 'utf8');
  console.log(data);
  this.Urls = data.split("\n");
  if (this.Urls[this.Urls.length - 1] === "") {
    this.Urls = this.Urls.slice(0, this.Urls.length -1);
  }
};

exports.isUrlInList = function(checkUrl){
  var result = false;
  _.each(this.Urls, function(value){
    if(value === checkUrl){
      result =  true;
    }
  });
  return result;
};

exports.addUrlToList = function(){ //not using this in our implementation
};

exports.isURLArchived = function(checkUrl){
  var filepath = this.paths.archivedSites + "/" + checkUrl;
  return fs.existsSync(filepath);
};

exports.downloadUrls = function(){
  console.log(this.Urls);
  _.each(this.Urls, function(site){
    http.get("http://" + site, function(res) {
      console.log("Response is: ", res);
      var data = '';
      res.on('data', function(chunk){
        data += chunk;
      });
      res.on('end', function(){
        fs.writeFile(exports.paths.archivedSites + "/" + site, data, function(err){
          if(err){
            console.log(err);
          } else {
            console.log(site, " is written ");
          }
        });
      });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
      });
  });
};
