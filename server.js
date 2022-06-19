require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection')
const app = express();


// Database Connectivity
sequelize.authenticate()
  .then(() => console.log('Connected to MySQL successfully...'))
  .catch(err => console.log('Error: ',err))


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);


// Sync Sequelize Models to the Database
sequelize.sync({ force: false });


const PORT = process.env.PORT || 3001;
app.listen(PORT,() => {
  console.log(`App listening on port ${PORT}!`);
});
