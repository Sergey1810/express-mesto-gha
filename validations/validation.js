// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');

const url = (path, err) => {
  if (!isURL(path)) {
    // eslint-disable-next-line no-useless-escape
    return err.message('не верный url');
  }
  return path;
};

const cardIsValid = () => celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(url),
  }),
});

const userIsValid = () => celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().custom(url),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const updateUserIsValid = () => celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const avatarIsValid = () => celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(url),
  }),
});

const loginIsValid = () => celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const idIsValid = () => celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
});

module.exports = {
  cardIsValid,
  userIsValid,
  updateUserIsValid,
  avatarIsValid,
  loginIsValid,
  idIsValid,
};