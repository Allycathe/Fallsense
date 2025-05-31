import { Router } from "express"; 
import {authMiddleware} from "../middleware/authmiddleware.js";
import sql from "../db/db.js";

export const fallsRouter = Router();

fallsRouter.get('/', authMiddleware,async (req, res) => {
    const id= req.user.id;
    const query = 'SELECT * FROM falls where id_usuario = $1';
    const falls = await sql(query, [id]);
    res.render('falls', {falls});
});
