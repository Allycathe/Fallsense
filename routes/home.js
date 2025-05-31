import { Router } from "express"; 
import {authMiddleware} from "../middleware/authmiddleware.js";
import sql from "../db/db.js";

export const homeRouter = Router();
homeRouter.get('/', authMiddleware, async (req, res) => {
    res.render('home', {user: req.user});})
