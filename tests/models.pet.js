'use strict';

var Pet = require("../models/pet.js"),
    util = require("util"),
    mongoose = require("mongoose");
    
(function() {
   var server = 'ds051368.mongolab.com',
       port   = 51368 ,
       dbname = 'tails',
       uname = process.env.OPENSHIFT_MONGODB_DB_USERNAME ,
       password = process.env.OPENSHIFT_MONGODB_DB_PASSWORD
    
    var connection = util.format('mongodb://%s:%s@%s:%d/%s', 
                                 uname ,
                                 password,
                                 server, port, dbname)
    var conn = mongoose.connection;
    mongoose.connect(connection);
})();

exports['create'] = function(test) {
    var pet = new Pet();
    test.ok(pet.id != null);
    
    pet.save(function(err,doc) {
        
        Pet.findOne({ _id : pet.id },function(err,doc) {
            test.ok(err == null);
            test.ok(doc!=null);
            test.done();
        })
    });
}

exports['close'] = function(test) {
    mongoose.disconnect(function() {
        test.done();    
    });
}
