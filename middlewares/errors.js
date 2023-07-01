const UnauthorizedError = require("../errors/unauthorized-error");

const errorMiddlewares = (err, req, res, next) => {
    if (err.statusCode) {
        res.status(err.statusCode).send({ message: err.message });
    } else {
        throw new UnauthorizedError("ошибка сервера")
    }
    next();
}

module.exports = errorMiddlewares;