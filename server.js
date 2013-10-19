var http = require("http");
var express = require('express');

//Get the environment variables we need.
var ipaddr  = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port    = parseInt(process.env.OPENSHIFT_NODEJS_PORT) || 8080;

var app = express();

app.set('port', port);
app.set('ipaddr', ipaddr);

// temp
app.use('/mockjson', express.static(__dirname + '/mockjson'));

app.get('/*', function(req, res){
  var body = 'Hello World';
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', body.length);
  res.end(body);
});

app.listen(port, ipaddr, function(){
	console.log('%s: Node server started on %s:%d ...', Date(Date.now()), ipaddr, port);
});

