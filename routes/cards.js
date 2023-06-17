const router = require('express').Router();
const {getCards, createCard, deleteCardById, deleteLikeCardById, updateLikesCardById} = require('../controllers/cards.js');

router.get('/', getCards);

router.post('/', createCard);

router.delete('/:id', deleteCardById);

router.delete('/:id/likes', deleteLikeCardById);

router.put('/:id/likes', updateLikesCardById);


module.exports = router;