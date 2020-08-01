const {Schema,model} = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema  = new Schema ({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.methods.encryptPassword = async (password) =>{

    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password,salt);
}

userSchema.methods.validatePassword = async function(password)
{
   // console.log("////",password,this.password)
return bcrypt.compare(password,this.password)
}

userSchema.methods.isAdmin = function(username, password){
    if(username == "admin" && password == "admin"){
        return true;
    }
    else{
        return false;
    }
}
 
module.exports = model('User', userSchema);