var mongoose = require("mongoose");
var bcrypt   = require("bcrypt");

var Schema   = mongoose.Schema;
var userSchema = mongoose.Schema({
    local:{
        username: String,
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    }, 
    gameData:{
        cash:Number,
        xp:String,
        level:Number
    }
    
});

userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
}


module.exports = mongoose.model('User', userSchema);

