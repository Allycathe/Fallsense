import { Router } from "express"; 
import { authMiddleware } from "../middleware/authmiddleware";

const cookie_name='token';

export const authRouter = Router();
authRouter.get('/login', (req, res) => {
    res.render('login');
});

authRouter.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const query ='SELECT id, password from usuarios WHERE email =$1';
    const result =await sql(query, [email]);  
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
    res.redirect('/Login?error=unauthorized');
    return;
});

authRouter.get('/register', (req, res) => {
    res.render('register');
});
authRouter.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);

    const query = 'INSERT INTO usuarios (nombre, correo, password) VALUES ($1, $2, $3)';
    await sql(query, [name, email, hash]);
    res.redirect(302, '/login');
}); 