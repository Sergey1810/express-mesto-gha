const Card = require('../models/cards');
const ForbiddenError = require('../errors/forbidden-error');
const BadRequestError = require('../errors/bad-request-error');
const InternalServerError = require('../errors/internal-server-error');

const cardsBadRequestError = (e, res, next) => {
  if (e.name === 'ValidationError') {
    next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
  } if (e.name === 'CastError') {
    next(new BadRequestError('Карточка с указанным id не найдена.'));
  }
  next(new InternalServerError('На сервере произошла ошибка'));
};

// const cardNotFoundError = (card) => {
//     if (!card) {
//         return res.status(404).send({ message: `Карточка с указанным id не найдена.` });
//     }
//     return res.status(200).send(card);
// }

const getCards = (req, res, next) => Card.find({})
  .then((cards) => res.status(200).send(cards))
  .catch((e) => {
    cardsBadRequestError(e, res, next);
  });

const createCard = (req, res, next) => {
  const owner = req.user.id;
  const newCardData = req.body;
  return Card.create({ ...newCardData, owner })
    .then((newCard) => res.status(201).send(newCard))
    .catch((e) => {
      cardsBadRequestError(e, res, next);
    });
};

const deleteCardById = (req, res, next) => {
  const owner = req.user._id;
  const { id } = req.params;
  const card = Card.findById(id)
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((e) => {
      cardsBadRequestError(e, res, next);
    });
  if (card.owner !== owner) {
    next(new ForbiddenError('Переданы некорректные данные при удалении карточки.'));
  }
  return Card.findByIdAndRemove(id)
    .then((cardRemove) => {
      res.status(200).send({ data: cardRemove });
    })
    .catch((e) => {
      cardsBadRequestError(e, res, next);
    });
};

const deleteLikeCardById = (req, res, next) => {
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
      cardsBadRequestError(e, res, next);
    });
};

const updateLikesCardById = (req, res, next) => {
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
      cardsBadRequestError(e, res, next);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  deleteLikeCardById,
  updateLikesCardById,
};
