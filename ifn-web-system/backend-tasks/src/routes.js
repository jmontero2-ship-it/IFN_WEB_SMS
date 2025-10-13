import express from 'express';
import jwt from 'jsonwebtoken';
import { initDB } from './db.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// Middleware para validar token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(403).json({ error: 'Token inválido' });
  }
};

// Rutas
router.get('/tareas', verifyToken, async (req, res) => {
  const db = await initDB();
  const tasks = await db.all('SELECT * FROM tasks WHERE assigned_to = ?', [req.user.id]);
  res.json({ user: req.user, tareas: tasks });
});

router.post('/tareas', verifyToken, async (req, res) => {
  const db = await initDB();
  const { name, description, assigned_to } = req.body;
  await db.run('INSERT INTO tasks (name, description, assigned_to) VALUES (?, ?, ?)', [name, description, assigned_to]);
  res.json({ message: 'Tarea creada correctamente' });
});

export default router;
