import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

dotenv.config();
const app = express();
const SECRET = process.env.JWT_SECRET || "ifn_secret";

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Función para abrir base de datos
async function openDb() {
  return open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });
}

// 🔐 LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { codigo_conglomerado, codigo_brigada, password } = req.body;

    const db = await openDb();
    const user = await db.get(
      "SELECT * FROM usuarios WHERE codigo_conglomerado = ? AND codigo_brigada = ? AND password = ?",
      [codigo_conglomerado, codigo_brigada, password]
    );

    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = jwt.sign({ id: user.id, rol: user.rol }, SECRET, {
      expiresIn: "8h",
    });

    res.json({
      message: "✅ Login exitoso",
      token,
      rol: user.rol,
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Auth-Service corriendo en puerto ${PORT}`));
