import jwt from 'jsonwebtoken';

const clave='ME_ECHE_TICS_I'
export const authMiddleware = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.cookies.token, clave)
        if (decoded) {
            req.user = decoded;
            return next();
        }
    } catch (error) {
            console.log('Error en authMiddleware:', error.message);
        return res.redirect('/auth/login');
    }
};