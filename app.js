// db.js
const mysql = require("mysql2/promise");
require("dotenv").config();

async function initializeDatabase() {
  try {
    // 1️⃣ Conectar al servidor MySQL
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "mysql.railway.internal",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "ALBkhRlwZjVOsahVgXsYXznLXOVrABlf",
      port: process.env.DB_PORT || 3306,
      multipleStatements: true // permite ejecutar varias consultas en una
    });
    console.log("✅ Conectado al servidor MySQL");

    const dbName = process.env.DB_NAME || "juego";

    // 2️⃣ Crear base de datos si no existe y usarla
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.changeUser({ database: dbName });
    console.log(`✅ Base de datos "${dbName}" asegurada`);

    // 3️⃣ Crear tabla resultados si no existe
    await connection.query(`
      CREATE TABLE IF NOT EXISTS resultados (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        intento INT NOT NULL,
        tiempo FLOAT NOT NULL,
        errores INT NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Tabla 'resultados' lista");

    return connection; // devolver la conexión para usarla en server.js
  } catch (err) {
    console.error("❌ Error al inicializar la base de datos:", err);
    process.exit(1);
  }
}

module.exports = initializeDatabase;
