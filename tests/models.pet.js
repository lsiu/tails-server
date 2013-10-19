'use strict';

var Pet = require("../models/pet.js"),
    util = require("util"),
    mongoose = require("mongoose"),
    db = require("./db.js")

db.connect();

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
