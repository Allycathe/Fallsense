import { Router } from "express"; 
import {authMiddleware} from "../middleware/auth.js";
import sql from "../db.js";


export const devicesRouter = Router();

devicesRouter.get('/devices', authMiddleware, async (req, res) => {
    const id= req.user.id;
    const query = 'SELECT * FROM dispositivos where id_usuario = $1';
    const devices = await sql(query, [id]);
    res.render('devices', {devices});
});