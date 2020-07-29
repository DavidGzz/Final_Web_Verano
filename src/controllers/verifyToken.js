const jwt = require("jsonwebtoken");
const config = require('../config');
const cookieParser = require("cookie-parser");

 function verifyToken(req,res,next){

const token = req.cookies.token || '';

console.log("token" , token);

    if(!token){
        return res.redirect('/')
    
    }
    else {
     const decoded = jwt.verify(token,config.secret)
     req.userId = decoded.id;
     next();
    }
}

module.exports = verifyToken;