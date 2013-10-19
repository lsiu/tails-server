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
    },
    creationTime: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model("pet", schema, "pets");


