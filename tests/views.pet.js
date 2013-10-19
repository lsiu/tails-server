'use strict'

var request = require('supertest'),
    express = require('express'),
    PetView = require("../views/pet"),
    mongoose = require('mongoose'),
    promise = require('promised-io/promise'),
    db = require("./db.js");


db.connect();

/*
exports["GET PET"] = function(test) {

    var app = express();

    app.get('/pet', PetView.get);    
    app.get('/pet/:id', PetView.get);
    
    request(app)
      .get('/pet/id-never-exist-1829379182')
      .expect('Content-Type', /json/)
      .expect(404)
      .end(function(err, res){
          test.ok(err == null);
          test.done();
      });
    
    request(app)
      .get('/pet')
      .expect('Content-Type', /html/)
      .expect(200)
      .end(function(err, res){
          test.ok(err == null);
          test.done();
      });
}
*/

exports["POST PET"] = function(test) {

    var app = express();
    app.use(express.bodyParser());

    app.get('/pet', PetView.get);    
    app.get('/pet/:id', PetView.get);
    app.get('/pet/:id/img', PetView.getImage);

    app.post('/pet',PetView.post);

    
    promise.seq([function() {
        var p = promise.defer();
        
    request(app)
      .post('/pet')
      .attach('image','example.jpg')
      .set('Accept-Format',"application/json")
      .expect('Content-Type', "application/json")
      .expect(201)
      .end(function(err, res){
          test.ok(err == null);

          //console.log(res);
          console.log("POST finished");
          var data = JSON.parse(res.res.text);
          p.resolve(data);
      });
        
        return p;
        
    },function(data) {
        var url = "/pet/" + data.id + "/img";
        console.log("GET " + url);
        
        request(app)
        .get(url)
        .expect('Content-Type',"image/jpeg")
        .expect(200)
        .end(function(err,res) {
            console.log(err);
            test.ok(err == null);
            test.done();
        });
        
    }]);
    
    
}

exports['close'] = function(test) {
    mongoose.disconnect(function() {
        test.done();    
    });
}
