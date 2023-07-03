const BadRequestError = require("../errors/bad-request-error");
const ConflictError = require("../errors/conflict-error");
const ForbiddenError = require("../errors/forbidden-error");
const InternalServerError = require("../errors/internal-server-error");
const NotFoundError = require("../errors/not-found-error");
const UnauthorizedError = require("../errors/unauthorized-error");

const errorMiddlewares = (err, req, res, next) => {
    if (err.statusCode === 400) {
        throw new BadRequestError("Не передан email или пароль")
    } else if (err.statusCode === 409) {
        throw new ConflictError("при регистрации указан email, который уже существует на сервере")
    } else if (err.statusCode === 403) {
        throw new ForbiddenError("попытка удалить чужую карточку")
    } else if (err.statusCode === 404) {
        throw new NotFoundError()
    } else if (err.statusCode === 401) {
        throw new UnauthorizedError("передан неверный логин или пароль")
    } 
    throw new InternalServerError()
    next();
}

module.exports = errorMiddlewares;