var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var schema = new Schema({
    name : {
        type : String    
    },
    type : {
        type : String
    },
    image : {
        type : Buffer
    }
});

module.exports = mongoose.model("pet", schema, "pets");


