const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const favSchema  = Schema ({
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
 
module.exports = mongoose.model('favorites', favSchema);