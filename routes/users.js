const router = require('express').Router();
const {getUsers, getUserById, createUser, updateUserById, updateAvatarUserById} = require('../controllers/users.js');

router.get('/', getUsers);

router.get('/:id', getUserById);

router.post('/', createUser);

router.patch('/:id', updateUserById);

router.patch('/:id/avatar', updateAvatarUserById);

module.exports = router;