const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCardById,
  deleteLikeCardById,
  updateLikesCardById,
// eslint-disable-next-line import/extensions
} = require('../controllers/cards.js');
// eslint-disable-next-line import/extensions
const { auth } = require('../middlewares/auth.js');
// eslint-disable-next-line import/extensions
const { idIsValid, cardIsValid } = require('../validations/validation.js');

router.get('/', auth, getCards);

router.post('/', auth, cardIsValid, createCard);

router.delete('/:id', auth, idIsValid, deleteCardById);

router.delete('/:id/likes', auth, idIsValid, deleteLikeCardById);

router.put('/:id/likes', auth, idIsValid, updateLikesCardById);

module.exports = router;
