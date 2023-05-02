/* eslint-disable no-console */
const mysql = require("mysql2");

const config = {
  database: process.env.MYSQL_DATABASE,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
};

const connection = mysql.createConnection(config);

connection.connect((err) => {
  if (err) {
    console.error(`error: ${err.message}`);
    return;
  }
  console.log("Connected to the MySQL server");
});

module.exports = connection;
