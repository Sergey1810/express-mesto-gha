const bcrypt = require('bcrypt');
const User = require('../models/users');
const { generateToken } = require('../utils/token');
const BadRequestError = require('../errors/bad-request-error');

const SALT_ROUNDS = 10;

// const userNotFoundErrors = (user) => {
//     if (!user) {
//         return res.status(404).send({ message: `Пользователь по указанному id не найден.` });
//     }
//     return res.status(200).send(user);
// }

const userBadRequestError = (e, res) => {
  if (e.name === 'ValidationError') {
    return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
  } if (e.name === 'CastError') {
    return res.status(404).send({ message: 'Пользователь по указанному id не найден.' });
  }
  return res.status(500).send({ message: 'На сервере произошла ошибка' });
};

const getUserMe = (req, res) => {
  const { id } = req.user;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(403).send({ message: 'Такого пользователя не существует' });
      }
      return res.status(200).send(user);
    })
    .catch((e) => {
      userBadRequestError(e, res, id);
    });
};

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch((e) => userBadRequestError(e, res));

const getUserById = (req, res) => {
  const { id } = req.params;
  return User.findById(id)
    .then((user) => res.status(200).send(user))
    .catch((e) => userBadRequestError(e, res));
};

const createUser = (req, res) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Не передан email или пароль');
  }
  return User.findOne({ email })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (user) {
        return res.status(409).send({ message: 'Пользователь уже существует' });
      }
      bcrypt.hash(
        password,
        SALT_ROUNDS,
        (err, hash) => User.create({
          email,
          password: hash,
          name,
          about,
          avatar,
        })
          .then((users) => res.status(201).send(users)),
      );
    })
    .catch((e) => {
      userBadRequestError(e, res);
    });
};

const updateUserById = (req, res) => {
  const { id } = req.params;
  const updateUser = req.body;
  return User.findByIdAndUpdate(id, updateUser)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((e) => {
      userBadRequestError(e, res);
    });
};

const updateAvatarUserById = (req, res) => {
  const { id } = req.params;
  const { avatar } = req.body;
  return User.findByIdAndUpdate(id, { avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((e) => {
      userBadRequestError(e, res);
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Не передан email или пароль' });
  }
  return User.findOne({ email })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return res.status(403).send({ message: 'Такого пользователя не существует' });
      }
      bcrypt.compare(password, user.password, (err, isPasswordMatch) => {
        if (!isPasswordMatch) {
          return res.status(403).send({ message: 'Неправильный пароль' });
        }
        const token = generateToken(user._id);
        return res.status(200).send({ token });
      });
    })
    .catch((e) => {
      userBadRequestError(e, res);
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  updateAvatarUserById,
  login,
  getUserMe,
};
