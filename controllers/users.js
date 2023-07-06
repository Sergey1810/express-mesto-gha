const bcrypt = require('bcrypt');
const User = require('../models/users');
const { generateToken } = require('../utils/token');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const ConflictError = require('../errors/conflict-error');
const InternalServerError = require('../errors/internal-server-error');

const SALT_ROUNDS = 10;

// const userNotFoundErrors = (user) => {
//     if (!user) {
//         return res.status(404).send({ message: `Пользователь по указанному id не найден.` });
//     }
//     return res.status(200).send(user);
// }

const userBadRequestError = (e, res, next) => {
  if (e.name === 'ValidationError') {
    next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
  } if (e.name === 'CastError') {
    next(new NotFoundError('Пользователь по указанному id не найден.'));
  }
  return next(new InternalServerError('На сервере произошла ошибка'));
};

const getUserMe = (req, res, next) => {
  const { id } = req.user;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        next(new ForbiddenError('Такого пользователя не существует'));
      }
      return res.status(200).send(user);
    })
    .catch((e) => {
      userBadRequestError(e, res, id);
    });
};

const getUsers = (req, res, next) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch((e) => userBadRequestError(e, res, next));

const getUserById = (req, res) => {
  const { id } = req.params;
  return User.findById(id)
    .then((user) => res.status(200).send(user))
    .catch((e) => userBadRequestError(e, res));
};

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;
  if (!email || !password) {
    next(new BadRequestError('Не передан email или пароль'));
  }
  return User.findOne({ email })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (user) {
        next(new ConflictError('Пользователь уже существует'));
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

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new BadRequestError('Не передан email или пароль'));
  }
  return User.findOne({ email })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        next(new ForbiddenError('Такого пользователя не существует'));
      }
      bcrypt.compare(password, user.password, (err, isPasswordMatch) => {
        if (!isPasswordMatch) {
          next(new ForbiddenError('Неправильный пароль'));
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
