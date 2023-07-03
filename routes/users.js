const router = require('express').Router();
const { getUsers, getUserById, createUser, updateUserById, updateAvatarUserById, login, getUserMe } = require('../controllers/users.js');
const { auth } = require('../middlewares/auth.js')

router.get('/', auth, getUsers);

router.get('/me', auth, getUserMe);

router.get('/:id', auth, getUserById);

router.patch('/:id', auth, updateUserById);

router.patch('/:id/avatar', auth, updateAvatarUserById);

router.post('/signin', login);

router.post('/signup', createUser);

module.exports = router;