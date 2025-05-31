import { session, Telegraf } from "telegraf";
import { Scenes } from "telegraf";
import { Stage } from "telegraf/scenes";
import sql from "../db/db.js"

import dotenv from 'dotenv';
dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const {WizardScene} = Scenes;

export const bot = new Telegraf(token);

bot.start((ctx)=>ctx.reply('Hola, bienvenido a fallsense \nPorque cada segundo cuenta'));

bot.command('hola', (ctx) => {
    ctx.reply('Hola, bienvenido a  \n Porque cada segundo cuenta');
});

const userData = new WizardScene(
    'userData',
    (ctx)=>{
        ctx.reply('Porfavor ingresa tu nombre');
        ctx.wizard.next();
    },
    (ctx)=>{
        ctx.wizard.state.nombre=ctx.message.text;
        ctx.reply('Ingresa tu apellido');
        ctx.wizard.next();
    },
    (ctx)=>{
        ctx.wizard.state.apellido=ctx.message.text;
        ctx.reply('Ingresa tu correo');
        ctx.wizard.next();
    },
    async (ctx)=>{
        ctx.wizard.state.correo=ctx.message.text;

        const {nombre, apellido, correo}=ctx.wizard.state;
        console.log('datos', nombre, apellido, correo)
        try{
            const consulta='SELECT id, name, lastname, mail FROM usuario WHERE name % $1 AND lastname % $2 AND mail ILIKE $3 ORDER BY SIMILARITY(name, $1) DESC, SIMILARITY(lastname, $2) DESC LIMIT 1;';
                const respuesta = await sql.query(consulta, [nombre, apellido, correo])
            
            if(respuesta.length==0){
                ctx.reply('El usuario no esta registrado/n favor visitar la pagina web');
                ctx.scene.leave();
            }
            else{
                const id=respuesta[0].id;
                console.log('id',id)
                const id_chat=ctx.chat.id;
                console.log('id_chat', id_chat);
                const insercion='UPDATE usuario SET id_chat=$1 where id=$2'
                await sql.query(insercion,[id_chat,id])
                ctx.reply('✅ ¡Usuario vinculado correctamente! Ahora recibirás notificaciones en este chat.');
                ctx.scene.leave();
            }
            }catch(error){
                console.log(error)
                ctx.reply('Hubo un error con el servicio, intente más tarde')
            }
    },
);

const stage=new Stage([userData]);
bot.use(session());
bot.use(stage.middleware());

bot.command('registrar', (ctx)=>{
    console.log('registrar')
    ctx.scene.enter('userData');
});

bot.launch();
export default bot;