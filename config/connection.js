require('dotenv').config();

const Sequelize = require('sequelize');


module.exports = new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PW,{
  host: 'localhost',
  dialect: 'mysql',
  logging: false,    // Log messages in console for sequelize activties
  operationAliases: false,
})


