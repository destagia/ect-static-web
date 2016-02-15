/*
  ECTテンプレートファイルをhtmlファイルにコンパイルするモジュール
*/
var ECT = require('ect');
var fs = require('fs');

var renderer = ECT({ root: __dirname + '/../views', watch: true});

Assets = {
  stylesheet: function(path) {
    return '<link rel="stylesheet" media="screen" href="/public/' + path + '">\n';
  },
  javascript: function (path) {
    return '<script src="/public/' + path + '" type="text/javascript"></script>\n';
  },
  path: function(path) {
    return '/public/' + path;
  }
};

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index) {
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

var execute = function(callback) {
  deleteFolderRecursive('html');
  fs.mkdirSync('html');
  fs.readFile('./mapping.json', 'utf8', function(err, mappings) {
    mappings = JSON.parse(mappings)
    mappings.forEach(function (mapping) {
      renderer.render(mapping.file_name, undefined, function(error, html) {
        if (error) {
          throw error;
        } else {
          fs.writeFileSync('html' + mapping.url, html);
        }
      });
    });
    callback();
  });
};

module.exports = {
  execute: execute
};