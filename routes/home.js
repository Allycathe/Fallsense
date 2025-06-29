import { Router } from "express"; 
import {authMiddleware} from "../middleware/authmiddleware.js";
import sql from "../db/db.js";
import bcrypt from 'bcryptjs';
import { generarOTP } from "../otp.js";

export const homeRouter = Router();

homeRouter.get('/home', authMiddleware, async (req, res) => {
    const id=req.user.id;
    
    const userQuery = await sql`SELECT name AS nombre, lastname AS apellido, email AS correo, otp FROM usuario WHERE id = ${id}`;
    const user = userQuery[0] || {};
    
    const dispositivos = await sql`SELECT d.id, d.usuario, d.bateria FROM device d JOIN usuario_esp ue ON ue.id_esp = d.id WHERE ue.id_usuario = ${id};`;

    const caidas = await sql`SELECT u.name || ' ' || u.lastname AS usuario, f.fecha AS timestamp FROM fall f JOIN usuario u ON f.id_usuario = u.id WHERE f.id_usuario = ${id} ORDER BY f.fecha DESC LIMIT 5;`;
    res.render('home', {user, dispositivos, caidas});})

homeRouter.get('/devices', authMiddleware, async (req, res) => {
    try{
        const id= req.user.id;
        const devices = await sql`SELECT d.id, d.usuario, d.bateria FROM device d JOIN usuario_esp ue ON ue.id_esp = d.id WHERE ue.id_usuario = ${id};`;
        res.render('devices', {devices});
    }
    catch(e){
        console.error(error);
        res.status(500).send('Error al cargar dispositivos');
    }
});

homeRouter.get('/falls', authMiddleware,async (req, res) => {
    const id= req.user.id;
    const falls = await sql`SELECT * FROM fall WHERE id_usuario = ${id}`;
    res.render('falls', {falls});
});

homeRouter.post('/profile/edit', authMiddleware, async (req, res) => {
  const id = req.user.id;
  const {nombre,apellido,correo,contrasena_actual,nueva_contrasena} = req.body;

  const usuarios = await sql`SELECT * FROM usuario WHERE id = ${id}`;
  if (usuarios.length === 0) {
    return res.status(404).send('Usuario no encontrado');
  }
  const usuario = usuarios[0];

  const match = await bcrypt.compare(contrasena_actual, usuario.password);
  if (!match) {
    return res.status(401).send('Contraseña actual incorrecta');
  }

  let nuevaPassword = usuario.password;
  if (nueva_contrasena && nueva_contrasena.trim() !== '') {
    nuevaPassword = await bcrypt.hash(nueva_contrasena, 10);}

  await sql` UPDATE usuario SET name = ${nombre}, lastname = ${apellido}, email = ${correo}, password = ${nuevaPassword} WHERE id = ${id}`;
  res.redirect('/home');
});

homeRouter.post('/otp/reset', authMiddleware, async (req, res) => {
  const id = req.user.id;
  const nuevoOtp = generarOTP();

  await sql`UPDATE usuario SET otp = ${nuevoOtp} WHERE id = ${id}`;

  res.json({ success: true, otp: nuevoOtp });
});

