import { Router } from "express"; 
import bcrypt from 'bcryptjs';
import sql from "../db/db.js";
import jwt from 'jsonwebtoken';

const clave='ME ECHE TICS I'
const Cookie_name='token';

export const authRouter = Router();
authRouter.get('/login', (req, res) => {
    res.render('login');
});

authRouter.post('/login', async (req, res) => {
    const {email, password} = req.body;
    console.log(email, password)
    const result =await sql.query('SELECT id, password from usuario WHERE mail =$1', [email]);  
    if(result.length === 0){
        res.redirect(302, '/login?error=unauthorized');
    }
    const id= result[0].id;
    const hash=result[0].password;
    if(bcrypt.compareSync(password, hash)){
        const expiresIn = Math.floor(Date.now() / 1000) + (60 * 60);
        const token = jwt.sign({ id, exp:expiresIn }, clave);
        res.cookie(Cookie_name, token,{
            maxAge: 60 * 60 * 1000, // 1 hour
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
        })
        res.redirect(302, '/');
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
    try{
        await sql.query('INSERT INTO usuario (name, lastname, mail, password) VALUES ($1, $2, $3, $4)',[nombre, apellido, email, hash])
    res.redirect(302, '/auth/login');
    }
    catch(error){
        res.redirect(302, '/auth/register?error=usuario-existe');
    }
    
}); 