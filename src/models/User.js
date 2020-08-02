const {Schema,model, Mongoose} = require('mongoose');
const bcrypt = require('bcryptjs');
const Videogame = require("../models/Videogame");

const userSchema  = new Schema ({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    likedGames: [{
        // HACER QUE ESTE ARRAY SEA DE TIPO VIDEOGAME
    }]
});

userSchema.methods.encryptPassword = async (password) =>{

    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password,salt);
}

userSchema.methods.validatePassword = async function(password)
{
    return bcrypt.compare(password,this.password)
}

userSchema.methods.isAdmin = function(username, password){
    if(username == "admin"){
        return true;
    }
    else{
        return false;
    }
}

module.exports = model('User', userSchema);