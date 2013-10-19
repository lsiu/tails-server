var http = require("http");
var express = require('express'),
    util = require("util"),
    mongoose = require('mongoose');

var pet = require("./views/pet.js");

//Get the environment variables we need.
var ipaddr  = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port    = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var db  = {
    username : process.env.OPENSHIFT_MONGODB_DB_USERNAME || "",
    password : process.env.OPENSHIFT_MONGODB_DB_PASSWORD || "",
    host : process.env.OPENSHIFT_MONGODB_DB_HOST || "localhost" ,
    port :process.env.OPENSHIFT_MONGODB_DB_PORT || 27019 ,
    collection : process.env.OPENSHIFT_APP_NAME || "tails"
};


/* Database Initialization */

mongoose.connection
.on('error', console.error.bind(console, 'mongodb connection error:'))
.once('open', function () {
    console.log("mongodb connection establish");
});

(function() {
    
    var connection = util.format('mongodb://%s:%s@%s:%d/%s', 
                                 db.username ,
                                 db.password,
                                 db.host, 
                                 db.port, 
                                 db.collection);
    var conn = mongoose.connection;
    mongoose.connect(connection);
    
})();

/* Express and routing */

var app = express();

app.set('port', port);
app.set('ipaddr', ipaddr);

// temp
app.use('/mockjson', express.static(__dirname + '/mockjson'));

app.get('/', function(req, res){
  var body = 'Hello World';
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', body.length);
  res.end(body);
});

app.get('/pet', pet.get);    
app.get('/pet/:id', pet.get);
app.post('/pet',pet.post);

app.listen(app.get('port'));

console.log("Server running at http://" + ipaddr + ":" + port + "/");
