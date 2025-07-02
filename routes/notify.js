import sql from '../db/db.js';
import bot from '../Telegram/bot.js'
import { Router } from "express";

export const notifyRouter = Router();

notifyRouter.post('/:id_usuario/:id_esp', async (req, res) => {
  try {
    const { id_usuario, id_esp } = req.params;
    const {datos} = req.body;
    console.log(datos);
    await sql`INSERT INTO fall(id_usuario, id_esp, fecha) VALUES(${id_usuario}, ${id_esp}, NOW())`;
    const chats = await sql`SELECT ut.id_chat FROM usuario_esp ue JOIN usuario_telegram ut ON ut.id_usuario = ue.id_usuario WHERE ue.id_esp = ${id_esp}`;
    const deviceResult = await sql`SELECT usuario FROM device WHERE id = ${id_esp}`;
    const nombreDispositivo = deviceResult.length > 0 ? deviceResult[0].usuario : 'Dispositivo desconocido';

    for (const chat of chats) {
      await bot.telegram.sendMessage(
        chat.id_chat, 
        `⚠️ Se ha registrado una caída, se cayo: ${nombreDispositivo}\n❤️ Latidos: ${datos}`
      );

    res.status(201).send('Caída registrada y notificada correctamente');
    } 
}catch (error) {
    console.error('error:', error);
    res.status(500).send('Error al registrar la caída');
  }
});

notifyRouter.get('/caida', async (req, res) => {
    res.redirect('/');
});