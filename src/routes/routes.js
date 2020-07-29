const express = require('express');
const router = express.Router();
const Videogame = require('../models/Videogame');
const User = require('../models/User');

// AGREGAR JUEGOS
router.post('/add', async (req,res) =>{
    const videogame = new Videogame(req.body);
    await videogame.save();
    res.redirect('/');
});

router.get('/index', async (req, res) => {
    const user = await User.find();
    res.render('index', {user});
});

module.exports = router;