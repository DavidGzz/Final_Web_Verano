const express = require('express');
const router = express.Router();
const User = require("../models/User");
const Videogame = require("../models/Videogame");
const jwt =  require('jsonwebtoken')
const config = require('../config');
const verifyToken = require("./verifyToken.js");
const path = require("path");
const cookieParser = require("cookie-parser");

router.get('/signup', async (req, res) => {
    res.render('signup');
});

router.get('/signin', async (req, res) => {
    res.render('signin');
});

// Para que el usuario se registre
router.post("/signup",async (req,res,next)=>{
     const {username,password} = req.body
   
    const user = new User({
        username:username,
        password: password
    });
    
   user.password = await user.encryptPassword(user.password);
  await user.save();
   const token =  jwt.sign({id:user._id ,
                            idAdmin:true,
    },config.secret,{
        expiresIn: 60*60*24
    })
    res.redirect('/index');
})

// Para que el usuario haga login
router.post("/signin",async (req,res,next)=>{
    console.log(req.body)
    const {username,password} = req.body;
   
    const user = await User.findOne({username:username});
    console.log(username,password)
    if (!user){
        return res.status(404).send("The user does not exist")
    }
    else {
      const valid =  await user.validatePassword(password)
      if (!valid){
          return res.status(401).json({auth:false,token:null});
      }
      else {
       const token =  jwt.sign({id:user._id}, config.secret,{
            expiresIn: 60*60*24
        })
        res.cookie('token', token , {
            httpOnly:true,
            maxAge: 30000
        })
        res.redirect('/index')

      }
      
    }
})

// LLEVA AL USUARIO RECIÉN LOGGEADO O SIGNED A LA PAGINA PRINCIPAL
router.get("/index",verifyToken, async (req,res)=>{
    const user = await User.findById(req.userId,{password:0});
    console.log(`USER ${user}`);
    const videogames = await Videogame.find();
    res.render('index', {user, videogames});
})

// LLEVA AL USUARIO A SU PERFIL
// POR HACER ***
router.get("/profile", verifyToken, async (req,res,next)=>{
    
    const user = await User.findById(req.userId,{password:0});
    const videogames = await Videogame.find();
    if(!user){
        return res.status(404).send("No user found");
    }
    else {
        res.render('profile', {user, videogames});
    }
})

// AGREGA JUEGOS A LA BD
router.post('/add', async (req,res) =>{
    const videogame = new Videogame(req.body);
    await videogame.save();
    res.redirect('/index');
});

// HACE LOGOUT
router.get("/logout", (req,res)=>{
     res.cookie("token","",{
       maxAge:-1
     }) ;
     res.redirect("/");
})

// REDIRECCIONA AL HOME COMO PAGIN INICIAL
router.get('/', async (req,res) =>{
    res.render('home');
});

module.exports = router;