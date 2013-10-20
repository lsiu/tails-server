'use strict'

var models = require("../models"),
    swig = require("swig"),
    fs = require("fs"),
    promise = require('promised-io/promise');

var getonedog = function(req,res) {
  /*  if (req.files === undefined ||
        req.files.image === undefined) {
        res.send(412);
        res.end();
        return;
    }*/

    var id = req.params.id,
        code = 500;
    
    console.log(id);

    promise.seq([function() {
        var p = promise.defer();
        if (id == undefined) {
            code = 404;
            p.reject();
        } else {
            code = 200;
            p.resolve();
        }
        return p
    },function() {
        var p = promise.defer();
        
        models.Pet.find(function(err,doc) {
            if (err) {
                code = 404;
                p.reject();
            } else {
                p.resolve(doc);
            }
            
        });
        
        return p;
    }
                 
    ]).then(function(data) {
    
    var body = swig.renderFile('templates/template.html', {
    name: data.name,
    type: data.type,
    img: new Buffer(data.image).toString('base64')
    });
       
    res.setHeader('Content-type', 'text/html');
    res.send(code,body);
    res.end();

    },function() { // Error handling is not defined.
        res.send(code);
        res.end();    
    });    
  
}


// get with no ID: give them a list of dogs

var get = function(req,res) {
    var id = req.params.id,
    code = 500;
    if (id != undefined) {
        return getonedog(req,res);
    }
    return getdoglist(req,res);
}

var getdoglist = function(req,res) {
    var code = 500;

    promise.seq([function() {
        var p = promise.defer();        
        models.Pet.find(function(err,doc) {
            if (err) {
                code = 404;
                p.reject();
            } else {
                p.resolve(doc);
            }
        });
        return p;
    }
                 
    ]).then(function(data) {
    
    var body = "";    
    for (var i = 0; i < data.length; i++) {
        if (data[i].image != undefined) {
            
        var base64_dog = new Buffer(data[i].image).toString('base64');
        
        body += "<h3>Dog: " + data[i].name + "</h3>";
        body += "Type of Dog: " + data[i].type + "<br />";
        body += "<img alt='Embedded Image' src='data:image/png;base64," + base64_dog + "' /> <hr />";
        }
    }
       
	 res.render(body);
    //res.setHeader('Content-type', 'text/html');
    //res.send(code,body);
    //res.end();

    },function() { // Error handling is not defined.
        res.send(code);
        res.end();    
    });    
  
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

function getImage(req,res,next) {
    var id = req.params.id,
        code = 500;
    
    promise.seq([function() {
        var p = promise.defer();
        if (id == undefined) {
            code = 404;
            p.reject();
        } else {
            code = 200;
            p.resolve();
        }
        return p
    },function() {
        var p = promise.defer();
        
        models.Pet.findOne({ _id : id},function(err,doc) {
            if (err) {
                code = 404;
                p.reject();
            } else {
                p.resolve(doc.image);
            }
            
        });
        
        return p;
    }
                 
    ]).then(function(data) {
        res.set("Content-Type","image/jpeg");
        res.send(code,data);
        res.end();
    },function() { // Error handling is not defined.
        res.send(code);
        res.end();    
    });
        
}

exports.get = get;

exports.post = post;

exports.getImage = getImage;
