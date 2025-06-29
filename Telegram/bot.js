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
        ctx.reply('Porfavor ingresa tu correo');
        ctx.wizard.next();
    },
    (ctx)=>{
        ctx.wizard.state.correo=ctx.message.text;
        ctx.reply('Ingresa otp');
        ctx.wizard.next();
    },
    async (ctx)=>{
        ctx.wizard.state.otp=ctx.message.text;
        const {correo, otp}=ctx.wizard.state;
        try{
            const respuesta= await sql`SELECT id, name, email FROM usuario WHERE email = ${correo} and otp=${otp}`;
            if(respuesta.length==0){
                ctx.reply('El usuario no esta registrado/n favor visitar la pagina web');
                ctx.scene.leave();
            }
            else{
                const id=respuesta[0].id;
                const id_chat=ctx.chat.id;
                await sql`INSERT INTO usuario_telegram (id_usuario, id_chat) VALUES (${id}, ${id_chat}) ON CONFLICT (id_usuario) DO UPDATE SET id_chat = EXCLUDED.id_chat`;
                ctx.reply('✅ ¡Usuario vinculado correctamente! Ahora recibirás notificaciones en este chat.');
                ctx.scene.leave();
            }
            } catch (error) {
              console.error('❌ Error durante el registro:', error); 
            }
    },
);

const stage=new Stage([userData]);
bot.use(session());
bot.use(stage.middleware());

bot.command('registrar', (ctx)=>{
    ctx.scene.enter('userData');
});
bot.command('desvincular', async (ctx) => {
  const id_chat = ctx.chat.id;
  try {
    const usuario = await sql`SELECT u.id, u.name FROM usuario_telegram ut JOIN usuario u ON u.id = ut.id_usuario WHERE ut.id_chat = ${id_chat}`;
    if (usuario.length === 0) {
      await ctx.reply('⚠️ No hay ningún usuario vinculado a este chat.');
      return;
    }

    const user = usuario[0];
    await sql`UPDATE usuario_telegram SET id_chat = NULL WHERE id_usuario = ${user.id}`;
    await ctx.reply(`✅ Usuario ${user.name} desvinculado exitosamente.`);
  } catch (error) {
    console.error('❌ Error en /desvincular:', error);
    await ctx.reply('❌ Hubo un error al desvincular. Intenta más tarde.');
  }
});


bot.launch();
export default bot;