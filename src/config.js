// filepath: /Users/erickborges/Documents/Marca_Personal/Movies-App/backend/src/config.js
const { config } = require('dotenv');

config();

module.exports = {
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
  },
};