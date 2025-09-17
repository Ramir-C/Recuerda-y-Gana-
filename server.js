require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const initializeDatabase = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

let db;

(async () => {
  // Inicializar la base de datos antes de arrancar el servidor
  db = await initializeDatabase();

  // Ruta para guardar datos
  app.post("/save", async (req, res) => {
    const { nombre, intento, tiempo, errores } = req.body;
    try {
      await db.query(
        "INSERT INTO resultados (nombre, intento, tiempo, errores) VALUES (?, ?, ?, ?)",
        [nombre, intento, tiempo, errores]
      );
      res.status(200).send("✅ Datos guardados correctamente");
    } catch (err) {
      console.error("❌ Error al guardar en MySQL:", err);
      res.status(500).send("Error al guardar en la base de datos");
    }
  });

  // Ruta para mostrar resultados
  app.get("/api/resultados", async (req, res) => {
    try {
      const [rows] = await db.query("SELECT * FROM resultados ORDER BY id DESC");
      res.json(rows);
    } catch (err) {
      console.error("❌ Error al obtener datos:", err);
      res.status(500).send("Error en la base de datos");
    }
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
})();

