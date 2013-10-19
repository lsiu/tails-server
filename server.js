//var http = require("http");
var express = require('express');

//Get the environment variables we need.
var ipaddr  = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port    = process.env.OPENSHIFT_NODEJS_PORT || 8080;

var app = express();

app.set('port', port);
app.set('ipaddr', ipaddr);

// temp
app.use('/mockjson', express.static(__dirname + '/mockjson'));


//static page
app.use(express.static(__dirname + '/static'));

//app.get('/*', function(req, res){
  //var body = 'Hello World';
  //res.setHeader('Content-Type', 'text/plain');
  //res.setHeader('Content-Length', body.length);
  //res.end(body);
//});

app.listen(app.get('port'));

console.log("Server running at http://" + ipaddr + ":" + port + "/");
