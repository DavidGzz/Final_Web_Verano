const app = require('./app');
const config = require('./config');
const db = require('./database');

async function startServer(){
      await  app.listen(config.port);
      console.log('Server on port:', config.port)
}

startServer();