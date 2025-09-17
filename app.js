// app.js
const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
  host: "localhost",    // o tu host en Railway
  user: "root",         // tu usuario
  password: "tu_password", // tu contraseña
  database: "mi_base",  // tu base de datos
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

