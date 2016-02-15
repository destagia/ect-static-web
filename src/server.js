var http     = require("http"),
    url      = require("url"),
    path     = require("path"),
    fs       = require("fs"),
    compiler = require("./static_compiler");

var mime = {
  ".html": "text/html",
  ".css":  "text/css",
  ".js":   "application/javascript",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".gif":  "image/gif",
  ".txt":  "text/plain"
};

http.createServer(function(request, response) {
  var url = '.' + request.url;
  var mime_type = mime[path.extname(url)];
  var callback = function() {
    response.writeHead(200, {'Content-Type': mime_type || "text/plain"});
    var html = fs.readFileSync(url);
    response.end(html);
  };
  if (mime_type == mime['.html']) {
    compiler.execute(callback);
  } else {
    callback();
  }
}).listen(3000);
 
console.log('Server running at http://127.0.0.1:3000/');