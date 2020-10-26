var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Post = new Schema({
    postImg: {
        type: String
    },
    desc: {
        type: String,
        required: true
    },
    // Links To Share With The Post
    links: [{
        type: String
    }],
    owner: {
        type: String,
        required: true
    },
    type: {
        type: String
    }
},
{timestamps: true})

module.exports = mongoose.model('Post', Post);