const { verifyToken } = require('../utils/token');
const UnauthorizedError = require('../errors/unauthorized-error');

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const { authorization } = req.headers;
  let payload;
  try {
    if (!authorization) {
      throw new UnauthorizedError('передан неверный логин или пароль');
    }
    payload = verifyToken(authorization);
    if (!payload) {
      throw new UnauthorizedError('передан неверный логин или пароль');
    }
  } catch (e) {
    if (e.name === 'JsonWebTokenError') {
      return next(new UnauthorizedError('передан неверный логин или пароль'));
    }
    next(e);
  }
  req.user = payload;

  next();
};
module.exports = { auth };
