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
    res.redirect('/home');
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
            expiresIn: 100*100*100
        })
        res.cookie('token', token , {
            httpOnly:true,
            maxAge: 3000000
        })
        if (user.isAdmin(username, password)){
            res.redirect('/home');
        }
        else{
            res.redirect('/homeU');
        }
      }
      
    }
})

// LLEVA AL USUARIO RECIÉN LOGGEADO O SIGNED A LA PAGINA PRINCIPAL
router.get("/home",verifyToken, async (req,res)=>{
    const user = await User.findById(req.userId,{password:0});
    const videogames = await Videogame.find();
    res.render('home', {user, videogames});
})

router.get('/homeU', verifyToken, async (req, res) => {
    const user = await User.findById(req.userId,{password:0});
    const videogames = await Videogame.find();
    res.render('homeU', {user, videogames});
})

// LLEVA AL USUARIO A SU PERFIL
router.get("/profile/:id", verifyToken, async (req,res)=>{
    const user = await User.findById(req.params.id);
    await user.populate('likedGames').execPopulate();
    var genre_random = "Action";
    if (user.likedGames.length > 0){
        genre_random = user.likedGames[0].genre;
    }
    const suggested = await Videogame.aggregate([
        {$match: {genre: genre_random}},
        {$sample: {size: 5}}
    ]);
    res.render('profile', {user, suggested});
})

// AGREGA JUEGOS A LA BD
router.post('/add', async (req,res) =>{
    const videogame = new Videogame(req.body);
    await videogame.save();
    res.redirect('/home');
});

router.get('/check/:id', async (req,res) =>{
    const user = await User.findById(req.params.id);
    if(user.isAdmin(user.username)){
        res.redirect('/home')
    }
    else{
        res.redirect('/homeU')
    }
});

// AGREGAR JUEGOS A FAVORITOS
router.post('/fav/:idGame&:id', async (req,res) =>{
    const user = await User.findById(req.params.id);
    const videogame = await Videogame.findById(req.params.idGame);
    await user.likedGames.addToSet(videogame);
    await user.save();
    res.redirect('/profile/'+req.params.id);
});

// BORRA JUEGOS DE FAV
router.get('/delete/:id&:idGame',  async (req,res) =>{
    const user = await User.findById(req.params.id);
    var idGame = req.params.idGame;
    await user.populate('likedGames').execPopulate();
    //await user.likedGames.pop({_id: idGame});
    await user.likedGames.remove({_id: idGame});
    await user.save();
    res.redirect('/profile/'+req.params.id);
})

// BORRA JUEGOS
router.get('/delete/:id',  async (req,res) =>{
    var id = req.params.id;
    await Videogame.remove({_id: id});
    res.redirect('/home');
})

/*router.get('/delete/:id&:gId', async (req,res) =>{
    //const user = await User.findById(req.params.id);
    var id = req.params.gId;
    console.log("USER", id);
    //await user.likedGames.remove(_id);
    res.redirect('/profile');
})*/

// EDITA JUEGOS
router.get('/edit/:id', async(req,res) =>{
    const videogames = await Videogame.findById(req.params.id);
    res.render('edit', {videogames});
})
    
router.post('/edit/:id', async(req,res) =>{
    var  id = req.params.id;
    await Videogame.update({_id: id}, req.body);
    res.redirect('/home');
})
    

// HACE LOGOUT
router.get("/logout", (req,res)=>{
     res.cookie("token","",{
       maxAge:-1
     }) ;
     res.redirect("/");
})

// REDIRECCIONA AL HOME COMO PAGIN INICIAL
router.get('/', async (req,res) =>{
    res.render('index');
});

module.exports = router;