import { Router } from "express"; 
import {authMiddleware} from "../middleware/auth.js";
import sql from "../db.js";

export const fallsRouter = Router();

fallsRouter.get('/falls', authMiddleware,async (req, res) => {
    const id= req.user.id;
    const query = 'SELECT * FROM falls where id_usuario = $1';
    const falls = await sql(query, [id]);
    res.render('falls', {falls});
});
