const User = require("../models/users");
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/token');
const BadRequestError = require("../errors/bad-request-error");
const InternalServerError = require("../errors/internal-server-error");


const SALT_ROUNDS = 10

const userNotFoundErrors = (user) => {
    if (!user) {
        return res.status(404).send({ message: `Пользователь по указанному id не найден.` });
    }
    return res.status(200).send(user);
}

const userBadRequestError = (e, res) => {
    if (e.name === "ValidationError") {
        return res.status(400).send({ message: "Переданы некорректные данные при создании пользователя" });
    } else if (e.name === "CastError") {
        return res.status(404).send({ message: `Пользователь по указанному id не найден.` });
    }
    throw new InternalServerError()
}

const getUsers = (req, res) => {
    return User.find({})
        .then((users) => {
            return res.status(200).send(users);
        })
        .catch((e) => {
            throw new InternalServerError()
        })
};

const getUserById = (req, res) => {
    const { id } = req.params;

    return User.findById(id)
        .then((user) => {
            userNotFoundErrors(user)
        })
        .catch((e) => {
            userBadRequestError(e, res)
        })
};

const createUser = (req, res) => {
    const { email, password, name, about, avatar } = req.body;
    if (!email || !password) {
        throw new BadRequestError("Не передан email или пароль")
    }
    return User.findOne({ email })
        .then((user) => {
            if (user) {
                return res.status(409).send({ message: "Пользователь уже существует" });
            }
            bcrypt.hash(password, SALT_ROUNDS, function (err, hash) {
                return User.create({ email, password: hash, name, about, avatar })
                    .then((user) => {
                        return res.status(201).send(user);
                    })
            });
        })
        .catch((e) => {
            userBadRequestError(e, res)
        })
};

const updateUserById = (req, res) => {
    const { id } = req.params;
    const updateUser = req.body;
    return User.findByIdAndUpdate(id, updateUser)
        .then((user) => {
            res.status(200).send(user)
        })
        .catch((e) => {
            userBadRequestError(e, res)
        });
};

const updateAvatarUserById = (req, res) => {
    const { id } = req.params;
    const { avatar } = req.body
    return User.findByIdAndUpdate(id, { avatar: avatar })
        .then((user) => {
            res.send({ data: user })
        })
        .catch((e) => {
            userBadRequestError(e, res)
        });
};

const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: "Не передан email или пароль" });
    }
    return User.findOne({ email })
        .then((user) => {
            if (!user) {
                return res.status(403).send({ message: "Такого пользователя не существует" });
            }
            bcrypt.compare(password, user.password, function (err, isPasswordMatch) {
                if (!isPasswordMatch) {
                    return res.status(403).send({ message: "Неправильный пароль" });
                }
                const token = generateToken(user._id);
                console.log(token)
                return res.status(200).send({ token });
            });
        })
        .catch((e) => {
            userBadRequestError(e, res)
        })
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUserById,
    updateAvatarUserById,
    login
}