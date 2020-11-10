const mongoose = require('mongoose');
const crypto = require('crypto');
const uuid = require('uuid');

const cinemaSchema = new mongoose.Schema({
    name:  {
        type: String,
        trim: true,
        required: true
    },
    email:  {
        type: String,
        trim: true,
        required: true
    },
    hashed_password:  {
        type: String,
        required: true
    },
    salt: String,
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date
})
cinemaSchema
    .virtual("password")
    .set(function(password) {
        this._password = password;
        this.salt = uuid.v1();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function(){
        return this._password;
    });

// methods

cinemaSchema.methods = {
    authenticate: function(plainText){
        return this.encryptPassword(plainText) === this.hashed_password
    },

    encryptPassword: function(password) {
        if (!password) return "";
        try {
            return crypto
                        .createHmac("sha1", this.salt)
                        .update(password)
                        .digest("hex");
        }
        catch (err) {
            return "";
        }
    }
};


module.exports = mongoose.model('Cinema', cinemaSchema)