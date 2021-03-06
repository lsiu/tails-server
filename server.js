var http = require("http");
var express = require('express'),
    util = require("util"),
    mongoose = require('mongoose');

var pet = require("./views/pet.js");

//Get the environment variables we need.
var ipaddr  = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port    = parseInt(process.env.OPENSHIFT_NODEJS_PORT) || 8080;
var db  = {
    username : process.env.OPENSHIFT_MONGODB_DB_USERNAME || "",
    password : process.env.OPENSHIFT_MONGODB_DB_PASSWORD || "",
    host : process.env.OPENSHIFT_MONGODB_DB_HOST || "localhost" ,
    port :process.env.OPENSHIFT_MONGODB_DB_PORT || 27017 ,
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

var app = express(),
	swig = require("swig");

app.set('port', port);
app.set('ipaddr', ipaddr);


// temp
app.use('/mockjson', express.static(__dirname + '/mockjson'));

//static pages and assets
app.use(express.static(__dirname + '/static'));



//app.get('/', function(req,res){res.render(swig.renderFile('./templates/index.html', {}))});    

app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/templates');

// Swig will cache templates for you, but you can disable
// // that and use Express's caching instead, if you like:
app.set('view cache', false);
// // To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });
// // NOTE: You should always cache templates in a production environment.
// // Don't leave both of these to `false` in production!
app.get('/', function (req, res) {
   res.render('index', { /* template locals context */ });
   });
app.get('/qrgen', function (req, res) {
   res.render('qrgen', { domain: req.headers.host });
   });

app.get('/pet', pet.get); // returns html page with list of dogs
app.get('/pet/:id', pet.get); // returns html page with single dog


app.get('/good-dog/:id', function (req,res) { //gos to a form page
   res.render('form_testimonial', {id: req.params.id });
   });

app.get('/pet/:id/img', pet.getImage); // returns single image

app.post('/pet',pet.post);

app.get('/*', function(req, res){
  var body = 'page not found';
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', body.length);
  res.end( 404, body);
});

app.listen(port, ipaddr, function(){
	console.log('%s: Node server started on %s:%d ...', Date(Date.now()), ipaddr, port);
});
