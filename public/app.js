// db.js
const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || ""
});

// 1️⃣ Crear base de datos si no existe
connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'juego'}\``, (err) => {
  if (err) {
    console.error("❌ Error al crear la base de datos:", err);
    return;
  }
  console.log("✅ Base de datos asegurada");

  // 2️⃣ Cambiar a la base de datos
  connection.changeUser({ database: process.env.DB_NAME || 'juego' }, (err) => {
    if (err) {
      console.error("❌ Error al cambiar a la base de datos:", err);
      return;
    }
    console.log(`✅ Conectado a la base de datos ${process.env.DB_NAME || 'juego'}`);

    // 3️⃣ Crear tabla resultados si no existe
    connection.query(`
      CREATE TABLE IF NOT EXISTS resultados (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        intento INT NOT NULL,
        tiempo FLOAT NOT NULL,
        errores INT NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error("❌ Error al crear la tabla resultados:", err);
      else console.log("✅ Tabla resultados lista");
    });
  });
});

module.exports = connection;

