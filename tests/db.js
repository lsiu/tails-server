var util = require("util"),
    mongoose = require("mongoose");

function conn() {
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
}

exports.connect = conn;