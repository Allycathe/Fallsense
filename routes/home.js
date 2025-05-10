import { Router } from "express"; 
import {authMiddleware} from "../middleware/auth.js";
import sql from "../db.js";

export const homeRouter = Router();
homeRouter.get('/', authMiddleware, async (req, res) => {
    res.render('home', {user: req.user});})
