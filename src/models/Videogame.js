const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const videogameSchema  = Schema ({
    title: {
        type: String,
        required: true
    },
    description: String,
    genre: {
        type: String,
        required: true
    }
});
 
module.exports = mongoose.model('videogames', videogameSchema);