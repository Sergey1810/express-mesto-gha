const router = require('express').Router();
const {getCards, createCard, deleteCardById, deleteLikeCardById, updateLikesCardById} = require('../controllers/cards.js');
const { auth } = require('../middlewares/auth.js')

router.get('/',auth, getCards);

router.post('/',auth, createCard);

router.delete('/:id',auth, deleteCardById);

router.delete('/:id/likes',auth, deleteLikeCardById);

router.put('/:id/likes',auth, updateLikesCardById);


module.exports = router;