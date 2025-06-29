import { Router } from "express"; 
import bcrypt from 'bcryptjs';
import sql from "../db/db.js";
import jwt from 'jsonwebtoken';
import { generarOTP } from "../otp.js";

const clave='ME_ECHE_TICS_I'
const Cookie_name='token';

export const authRouter = Router();
authRouter.get('/login', (req, res) => {
    const error=req.query.error;
    res.render('login',{error});
});

authRouter.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const result =await sql.query('SELECT id, password from usuario WHERE email =$1', [email]);  
    if(result.length === 0){
        return res.redirect(302, '/auth/login?error=unauthorized');
    }
    const id= result[0].id;
    const hash=result[0].password;
    if(bcrypt.compareSync(password, hash)){
        const expiresIn = Math.floor(Date.now() / 1000) + (60 * 60);
        const token = jwt.sign({ id, exp:expiresIn }, clave);
        res.cookie(Cookie_name, token,{
            maxAge: 60 * 60 * 1000, // 1 hour
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
        })
        res.redirect(302, '/home');
        return;
    }
    res.redirect('/auth/login?error=unauthorized');
    return;
});

authRouter.get('/register', (req, res) => {
    res.render('register');
});
authRouter.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const [nombre, apellido] = name.trim().split(' ');
    const hash = bcrypt.hashSync(password, 10);
    const nuevoOtp = generarOTP();
    try{
        await sql.query('INSERT INTO usuario (name, lastname, email, password, otp) VALUES ($1, $2, $3, $4,$5)',[nombre, apellido, email, hash, nuevoOtp])
    res.redirect(302, '/home');
    }
    catch(error){
        res.redirect(302, '/auth/register?error=usuario-existe');
    };
}); 
authRouter.get('/logout', (req,res)=>{
    res.cookie(Cookie_name, ' ', { maxAge: 0 });
    res.redirect('/home');
})