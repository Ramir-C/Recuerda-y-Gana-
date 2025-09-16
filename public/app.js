require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const connection = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Ruta para guardar datos
app.post("/save", (req, res) => {
  const { nombre, intento, tiempo, errores } = req.body;

  const sql = "INSERT INTO resultados (nombre, intento, tiempo, errores) VALUES (?, ?, ?, ?)";
  connection.query(sql, [nombre, intento, tiempo, errores], (err, result) => {
    if (err) {
      console.error("❌ Error al guardar en MySQL:", err);
      return res.status(500).send("Error al guardar en la base de datos");
    }
    res.status(200).send("✅ Datos guardados correctamente");
  });
});

// Ruta para mostrar resultados
app.get("/api/resultados", (req, res) => {
  connection.query("SELECT * FROM resultados ORDER BY id DESC", (err, rows) => {
    if (err) {
      console.error("❌ Error al obtener datos:", err);
      return res.status(500).send("Error en la base de datos");
    }
    res.json(rows);
  });
});

// Rutas de páginas
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/resultados", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "resultados.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
