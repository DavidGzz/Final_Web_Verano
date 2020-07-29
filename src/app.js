const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
//app.use(express.static('src/public'));

app.use(require('./controllers/authController'));

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

module.exports = app;


/*const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');


const app = express();

// connection to  db
mongoose.connect('mongodb://localhost/videogames')
        .then(db => console.log('db connected'))
        .catch(err => console.log(err));


// importing routes
const indexRoutes = require('./routes/routes');

// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));

//routes
app.use('/', indexRoutes);

app.listen(app.get('port'), () =>{
    console.log(`server on port ${app.get('port')}`);
})*/