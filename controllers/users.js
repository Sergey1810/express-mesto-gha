const User = require("../models/users");
const bcrypt = require('bcrypt');
const { generateToken, verifyToken } = require('../utils/token');
const UnauthorizedError = require("../errors/unauthorized-error");

const SALT_ROUNDS = 10

const getUsers = (req, res) => {
    return User.find({})
        .then((users) => {
            return res.status(200).send(users);
        })
        .catch((e) => {
            res.status(500).send({ "message": "На сервере произошла ошибка" })
        })
};

const getUserById = (req, res) => {
    const { id } = req.params;

    return User.findById(id)
        .then((user) => {
            if (!user) {
                return res.status(404).send({ message: `Пользователь по указанному ${id} не найден.` });
            }
            return res.status(200).send(user);
        })
        .catch((e) => {
            if (e.name === "CastError") {
                return res.status(400).send({ message: `Пользователь по указанному ${id} не найден.` });
            }
            return res.status(500).send({ message: "На сервере произошла ошибка" });
        })
};

const createUser = (req, res) => {
    const { email, password, name, about, avatar } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: "Не передан email или пароль" });
    }

    // Найти пользователя по email
    // Если пользователя нет, то создать
    // Если пользователь есть, то вернуть ошибку
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
        .catch((err) => {
            console.log(`${email}`, `${password}`)
            return res.status(500).send("Ошибка сервера");
        })

    // return res.status(201).send({message: "Регистрация прошла успешно"});
};

const updateUserById = (req, res) => {
    const { id } = req.params;
    const updateUser = req.body;
    return User.findByIdAndUpdate(id, updateUser)
        .then((user) => {
            res.status(200).send(user)
        })
        .catch((e) => {
            if (e.name === "ValidationError") {
                return res.status(400).send({ message: "Переданы некорректные данные при создании пользователя" });
            } else if (e.name === "CastError") {
                return res.status(404).send({ message: `Пользователь по указанному ${id} не найден.` });
            }
            res.status(500).send({ message: 'На сервере произошла ошибка' })
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
            if (e.name === "ValidationError") {
                return res.status(400).send({ message: "Переданы некорректные данные при создании пользователя" });
            } else if (e.name === "CastError") {
                return res.status(404).send({ message: `Пользователь по указанному ${id} не найден.` });
            }
            res.status(500).send({ message: 'На сервере произошла ошибка' })
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
              // throw new UnauthorizedError(message)
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
        .catch((err) => {
            return res.status(500).send("Ошибка сервера");
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