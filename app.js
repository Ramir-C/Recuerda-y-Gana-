const express = require("express");
const mysql = require("mysql2");
const path = require("path");
require("dotenv").config(); // 👈 Cargar variables desde .env

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

// Conectar a la base
db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar a la base de datos:", err);
    return;
  }
  console.log("✅ Conectado a MySQL");
});

// Middleware para usar archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Ruta de inicio
app.get("/", (req, res) => {
  db.query("SELECT * FROM usuarios", (err, results) => {
    if (err) {
      console.error("Error al hacer query:", err);
      return res.status(500).send("Error en la base de datos");
    }
    res.send(`
      <h1>Usuarios en la base de datos</h1>
      <ul>
        ${results.map((row) => `<li>${row.nombre} - ${row.email}</li>`).join("")}
      </ul>
    `);
  });
});

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

