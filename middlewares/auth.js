const { verifyToken } = require('../utils/token');
const UnauthorizedError = require('../errors/unauthorized-error');
const InternalServerError = require('../errors/internal-server-error');

const auth = (req, res, next) => {
    const { authorization } = req.headers;
    let payload;
    try {
        if (!authorization) {
            throw new UnauthorizedError("передан неверный логин или пароль")
        }
        payload = verifyToken(authorization)
        if (!payload) {
            throw new UnauthorizedError("передан неверный логин или пароль")
        }  
    } catch (e) {
        next(e)
    }
    req.user = payload;
    
    next();
};

module.exports = { auth }