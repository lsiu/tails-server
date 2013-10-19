'use strict'

var models = require("../models"),
    fs = require("fs"),
    promise = require('promised-io/promise');

var get = function(req,res) {

    res.end();
}

var post = function(req,res,next) {
    if (req.files === undefined ||
        req.files.image === undefined) {
        res.send(412);
        res.end();
        return;
    }
    
    
    promise.seq([function() {
        var p = promise.defer(); 
        
        // Read from local file        
        // Dirty hack for quick prototype
        fs.readFile(req.files.image.path,function(err,data) {
            console.log("Read file",err);
           
            if (err != null ) {
                p.reject();
                res.send(500); // FIXME: Improve the handling later
                res.end();
            } else {
                p.resolve(data);               
            }
            
        });
        
        return p;
    },function(data) {
        var p = promise.defer(); 

        var pet = new models.Pet();
        pet.image = data;
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
            p.resolve();
        });

        return p;        
    }]);
    
}

exports.get = get;

exports.post = post;
