const {Schema,model} = require('mongoose');

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
 
module.exports = model('videogames', videogameSchema);