const mongoose = require('mongoose');
const config = require('./config');

mongoose.connect(config.db,{
    useNewUrlParser: true,
    useUnifiedTopology: true

})
.then(db => console.log("Database is connected"))
.catch(err => console.log("Err: ", err))