'use strict'

var models = require("../models");

var get = function(req,res) {

    res.end();
}

var post = function(req,res,next) {
    if (req.files === undefined ||
        req.files.image === undefined) {
    }
        
    var pet = new models.Pet();
    var result  = {};
    
    pet.save(function(err,doc) {
        var code = 500;
        if (err == null) {
            code = 201;
            result.id = doc.id;
        }
        res.set("Content-type", "application/json"); // FIXME
        res.send(code,JSON.stringify(result));
        res.end();
    });
    
}

exports.get = get;

exports.post = post;
