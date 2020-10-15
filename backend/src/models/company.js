var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var Company = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    desc: {
        type: String
    },
    logo: {
        type: String,
        default: 'logo/default.png'
    },
    hq: {
        type: String
    },
    size: {
        type: Number
    },
    webLink: {
        type: String
    },
    followers: [{
        type: String
    }],
    salt : String,
    verifyToken: {
        type: String
    },
    tokenExpiry: {
        type: Date
    },
    encry_password: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    adminVerified: {
        type: Boolean,
        default: false
    }
},
{timestamps: true})

Company.virtual("password")
    .set(function(password) {
        this._password = password
        this.salt = crypto.randomBytes(50).toString('hex');
        this.encry_password = this.securePassword(password)
    })

Company.methods = {
    authenticate :function(password) {
        return this.securePassword(password) === this.encry_password
    } , 

    securePassword: function(password) {
        if(!password) return "";
        try{
            return crypto.createHmac('sha256', this.salt)
            .update(password)
            .digest('hex')
        }
        catch(err) {
            return ""
        }
    }
}

module.exports = mongoose.model('Company', Company);