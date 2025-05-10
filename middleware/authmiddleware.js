import jwt from 'jsonwebtoken';

const clave='ME ECHE TICS'
export const authMiddleware = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.cookies.token, clave)
        if (decoded) {
            req.user = decoded;
            res.status(200).json({ message: 'Token is valid' });
            return next();
        }
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};