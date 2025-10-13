import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { openDb } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "ifn_secret_token";

// 🔐 Middleware de autenticación
function verificarToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Token requerido" });

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: "Token inválido" });
  }
}

// 📋 Ruta para listar tareas
app.get("/api/tareas", verificarToken, async (req, res) => {
  const db = await openDb();
  const tareas = await db.all("SELECT * FROM tareas");
  res.json(tareas);
});

app.get("/api/tareas", verificarToken, async (req, res) => {
  const db = await openDb();
  const tareas = await db.all("SELECT * FROM tareas");
  res.json(tareas); // ✅ devuelve array
});


app.listen(4001, () => console.log("Task-Service corriendo en puerto 4001"));
