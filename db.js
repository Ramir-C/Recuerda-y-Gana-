require("dotenv").config();
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT || 3306,
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar a MySQL:", err);
    process.exit(1);
  } else {
    console.log("✅ Conectado a la base de datos MySQL");
  }
});

module.exports = connection;
