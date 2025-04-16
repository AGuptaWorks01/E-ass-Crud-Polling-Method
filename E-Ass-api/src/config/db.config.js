require("dotenv").config();

module.exports = {
  HOST: process.env.DB_HOST || '127.0.0.1',
  USER: process.env.DB_USER || 'root',
  PASSWORD: process.env.DB_PASSWORD || 'root@123',
  DB: process.env.DB_NAME || 'CrudAssesment',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
