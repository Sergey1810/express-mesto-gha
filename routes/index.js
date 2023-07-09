const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-error');
// eslint-disable-next-line import/extensions
const { loginIsValid, userIsValid } = require('../validations/validation.js');

router.post('/signin', loginIsValid, login);
router.post('/signup', userIsValid, createUser);
router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('*', (req, res, next) => {
  // eslint-disable-next-line no-undef
  next(new NotFoundError('Не корректный путь'));
});

module.exports = router;
