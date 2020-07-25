const express = require('express');
const router = express.Router();
const Videogame = require('../models/Videogame');
//const Fav = require('../models/Fav');
const User = require('../models/User');

// Nos regresaria las tareas guardadas en la BD
router.get('/', async (req,res) =>{
    const videogames = await Videogame.find();
    //const fav = await Fav.find();
    res.render('index', {videogames});
});

// AGREGAR JUEGOS
router.post('/add', async (req,res) =>{
    const videogame = new Videogame(req.body);
    await videogame.save();
    res.redirect('/');
});

//IR AL PERFIL
router.get('/profile', async (req, res) => {
    const user = await User.find();
    const videogames = await Videogame.find();
    res.render('profile', {user, videogames});
});

// SIGN UP
router.get('/sign-up', async (req, res) => {
    const users = await User.find();
    res.render('sign-up', {users});
});

router.post('/sign-up', async (req,res) =>{
    const user = new User(req.body);
    await user.save();
    res.redirect('/');
});

// FAVORITOS
router.get('/fav/:id', async(req,res) =>{
    const videogame = await Videogame.findById(req.params.id);
    res.render('/', {videogame});
});

router.post('/fav/:id', async (req,res) =>{
    var  id = req.params.id;
    const fav = Videogame.findById(id);
    await fav.save();
    //res.redirect('/profile');
});
    

/*router.get('/fav', async(req,res) =>{
    const favorite = await Videogame.findById(req.params.id);
    res.render('profile', {favorite});
});*/
    

// Ruta que nos permita agregar nuevas tareas que vienen desde un metodo post
/*router.get('/search', async (req,res) =>{
    const videogame = await Videogame.find();
    const vg = videogame.genre;
    const arr = [];
    for(var i = 0; i < videogame.length; i++){
        if(videogame.genre == vg){
            arr[i] = videogame;
        }
    }
    res.render('index', {arr});
    /*await vg.save();
    res.redirect('/');
});*/

// Ruta para editar los datos

/*router.get('/edit/:id',   async(req,res) =>{
const task = await Task.findById(req.params.id);
res.render('edit', {task});
})


// Ruta para actualizar los datos

router.post('/edit/:id',   async(req,res) =>{
    var  id = req.params.id;
    await Task.update({_id: id}, req.body);
    res.redirect('/');
    })*/


// Ruta que nos permita eliminar tareas

/*router.get('/delete/:id',  async (req,res) =>{
    var id = req.params.id;
    await Task.remove({_id: id});
    res.redirect('/');
})*/

module.exports = router;