const User = require("../models/users");

const getUsers = (req, res) => {
    return User.find({})
        .then((users) => {
            return res.status(200).send(users);
        })
        .catch((e) => {
            res.status(500).send({"message": "На сервере произошла ошибка"})
        })
};

const getUserById = (req, res) => {
    const { id } = req.params;

    return User.findById(id)
        .then((user) => {
            if (!user){
                return res.status(400).send({ message: `Пользователь по указанному ${id} не найден.` });
            }
            return res.status(200).send(user);
        })
        .catch((e) => {
            if (e.name === "CastError"){
                return res.status(404).send({ message: `Пользователь по указанному ${id} не найден.` });
            }
            return res.status(500).send({ message: "На сервере произошла ошибка"});
        })
};

const createUser = (req, res) => {
    const newUserData = req.body;
    return User.create(newUserData)
        .then((newUser) => {
            return res.status(201).send(newUser);
        })
        .catch((e) => {
            if (e.name === "ValidationError"){
                return res.status(400).send({ message: "Переданы некорректные данные при создании пользователя" });
            }
            return res.status(500).send({ message: "На сервере произошла ошибка" });
        })
};

const updateUserById = (req, res) => {
    const { id } = req.params;
    const updateUser = req.body;
    return User.findByIdAndUpdate(id, updateUser)
        .then((user) => {
            res.status(201).send({ data: user })
        })
        .catch((e) => {
            if (e.name === "ValidationError"){
                return res.status(400).send({ message: "Переданы некорректные данные при создании пользователя" });
            } else if (e.name === "CastError"){
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
                if (e.name === "ValidationError"){
                    return res.status(400).send({ message: "Переданы некорректные данные при создании пользователя" });
                } else if (e.name === "CastError"){
                    return res.status(404).send({ message: `Пользователь по указанному ${id} не найден.` });
                }
                res.status(500).send({ message: 'На сервере произошла ошибка' })
            });
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUserById,
    updateAvatarUserById
}