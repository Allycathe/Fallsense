import sql from '../db/db.js';
import bot from '../private/bot.js'
import { Router } from "express";

export const notifyRouter = Router();

notifyRouter.post('/:id_usuario/:id_esp', async (req,res)=>{
    try{
        const {id_usuario, id_esp}= req.params
        const caida=await sql`SELECT usuario.id_chat FROM usuario, esp WHERE usuario.id=${id_usuario} and esp.id=${id_esp}`;
        const id_chat = caida[0].id_chat
        console.log('caida',caida)
        if(caida.length!=0){
            const fecha=Date.now();
            console.log('fecha', fecha)
            const query2='INSERT INTO TABLE fall(id_usuario, id_esp,fecha)'
            console.log('query2',query2)
            await sql`INSERT INTO fall(id_usuario, id_esp,fecha) VALUES(${id_usuario}, ${id_esp}, NOW())`  
        }
        await bot.telegram.sendMessage(id_chat, '⚠️ Se ha registrado una caída en tu dispositivo');
        res.status(201).send('Caída registrada correctamente');
    }
    catch(error){
        console.log('error:', error)
    }
    
})
notifyRouter.get('/caida', async (req, res) => {
    res.redirect('/');
});