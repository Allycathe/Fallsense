import { Router } from 'express';
import sql from '../db/db.js';

export const deviceRouter = Router();

deviceRouter.post('/vincular', async (req, res) => {
  try {
    const { id, nombre, correo, otp } = req.body;

    if (!id || !nombre || !correo || !otp) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: id, nombre, correo u otp' });
    }

    const usuario = await sql`SELECT id FROM usuario WHERE email = ${correo} AND otp = ${otp}`;
    console.log(usuario)

    if (usuario.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado o OTP incorrecto' });
    }

    const id_usuario = usuario[0].id;

    await sql`INSERT INTO usuario_esp (id_usuario, id_esp) VALUES (${id_usuario}, ${id}) ON CONFLICT DO NOTHING`;

    res.status(201).json({ message: 'Dispositivo vinculado exitosamente al usuario' });

  } catch (error) {
    console.error('Error vinculando dispositivo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


deviceRouter.post('/add', async (req, res) => {
  try {
    const { usuario } = req.body;

    if (!usuario) {
      return res.status(400).json({ error: 'Falta el usuario' });
    }
    const resultado = await sql`INSERT INTO device (usuario, bateria) VALUES (${usuario}, 100) RETURNING id`;
    res.status(201).json({ message: 'Dispositivo agregado correctamente', id: resultado[0].id });
  } catch (error) {
    console.error('Error agregando dispositivo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
