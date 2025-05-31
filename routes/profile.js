import { Router } from "express"; 
import {authMiddleware} from "../middleware/authmiddleware.js";
import sql from "../db/db.js";

export const profileRouter = Router();
profileRouter.get('/', authMiddleware, async (req, res) => {
    res.render('profile', {devices});
});