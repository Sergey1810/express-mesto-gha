const Card = require('../models/cards');
const ForbiddenError = require('../errors/forbidden-error');

const cardsBadRequestError = (e, res) => {
  if (e.name === 'ValidationError') {
    return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
  } if (e.name === 'CastError') {
    return res.status(400).send({ message: 'Карточка с указанным id не найдена.' });
  }
  return res.status(500).send({ message: 'На сервере произошла ошибка' });
};

// const cardNotFoundError = (card) => {
//     if (!card) {
//         return res.status(404).send({ message: `Карточка с указанным id не найдена.` });
//     }
//     return res.status(200).send(card);
// }

const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(200).send(cards))
  .catch((e) => {
    cardsBadRequestError(e, res);
  });

const createCard = (req, res) => {
  const owner = req.user.id;
  const newCardData = req.body;
  return Card.create({ ...newCardData, owner })
    .then((newCard) => res.status(201).send(newCard))
    .catch((e) => {
      cardsBadRequestError(e, res);
    });
};

const deleteCardById = (req, res) => {
  const owner = req.user._id;
  const { id } = req.params;
  const card = Card.findById(id)
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((e) => {
      cardsBadRequestError(e, res);
    });
  if (card.owner !== owner) {
    throw new ForbiddenError('Переданы некорректные данные при удалении карточки.');
  }
  return Card.findByIdAndRemove(id)
    .then((cardRemove) => {
      res.status(200).send({ data: cardRemove });
    })
    .catch((e) => {
      cardsBadRequestError(e, res);
    });
};

const deleteLikeCardById = (req, res) => {
  const { id } = req.params;
  return Card.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user.id } },
    { new: true },
  )
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((e) => {
      cardsBadRequestError(e, res);
    });
};

const updateLikesCardById = (req, res) => {
  const { id } = req.params;
  return Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user.id } },
    { new: true },
  )
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((e) => {
      cardsBadRequestError(e, res);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  deleteLikeCardById,
  updateLikesCardById,
};
