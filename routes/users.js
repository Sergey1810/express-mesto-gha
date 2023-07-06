const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUserById,
  updateAvatarUserById,
  getUserMe,
// eslint-disable-next-line import/extensions
} = require('../controllers/users.js');
// eslint-disable-next-line import/extensions
const { auth } = require('../middlewares/auth.js');
// eslint-disable-next-line import/extensions
const { avatarIsValid, updateUserIsValid } = require('../validations/validation.js');

router.get('/', auth, getUsers);

router.get('/me', auth, getUserMe);

router.get('/:id', auth, getUserById);

router.patch('/:id', auth, updateUserIsValid, updateUserById);

router.patch('/:id/avatar', auth, avatarIsValid, updateAvatarUserById);

module.exports = router;
