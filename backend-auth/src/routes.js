import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { initDB } from './db.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.post('/register', async (req, res) => {
  const db = await initDB();
  const { username, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  await db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashed, role]);
  res.json({ message: 'Usuario creado correctamente' });
});

router.post('/login', async (req, res) => {
  const db = await initDB();
  const { username, password } = req.body;
  const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, role: user.role });
});

export default router;
