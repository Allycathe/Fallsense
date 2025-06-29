import { Router } from 'express';
import sql from '../db/db.js';

export const deviceRouter = Router();

deviceRouter.post('/add', async (req, res) => {
  try {
    const { id, usuario } = req.body;

    if (!id || !usuario) {
      return res.status(400).json({ error: 'Faltan id o usuario' });
    }

    // Inserta el dispositivo
    await sql`
      INSERT INTO device (id, usuario, bateria) 
      VALUES (${id}, ${usuario}, 100) -- batería por defecto 100%
    `;

    res.status(201).json({ message: 'Dispositivo agregado correctamente' });
  } catch (error) {
    console.error('Error agregando dispositivo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
