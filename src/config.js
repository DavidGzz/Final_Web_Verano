const dotenv = require('dotenv');
dotenv.config();

module.exports = {
     'port': process.env.PORT || 3000,
     'db': "mongodb+srv://admin:ERE7fzrMpVXOnMIE@cluster0-r7op0.mongodb.net/<dbname>?retryWrites=true&w=majority",
     'secret': process.env.SECRET || "mysecretkey"
};