const Card = require('../models/cards');
const ForbiddenError = require('../errors/forbidden-error');
const BadRequestError = require('../errors/bad-request-error');
const InternalServerError = require('../errors/internal-server-error');
const NotFoundError = require('../errors/not-found-error');

const cardsBadRequestError = (e, res, next) => {
  if (e.name === 'ValidationError') {
    next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
  } if (e.name === 'CastError') {
    next(new BadRequestError('Карточка с указанным id не найдена.'));
  }
  next(new InternalServerError('На сервере произошла ошибка'));
};

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
  const owner = req.user.id;
  const { id } = req.params;
  Card.findById(id)
    // eslint-disable-next-line consistent-return
    .then((cards) => {
      if (!cards) {
        next(new NotFoundError('Переданы некорректные данные при удалении карточки.'));
      }
      if (cards.owner.toString() === owner) {
        return Card.findByIdAndRemove(cards.id)
          .then((cardRemove) => {
            res.status(200).send({ data: cardRemove });
          });
      }
      next(new ForbiddenError('Переданы некорректные данные при удалении карточки.'));
    })
    .catch(next);
};

const deleteLikeCardById = (req, res, next) => {
  const { id } = req.params;
  Card.findById(id)
    .then((cards) => {
      if (!cards) {
        next(new NotFoundError('Переданы некорректные данные при удалении лайка карточки.'));
      }
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
    });
};

const updateLikesCardById = (req, res, next) => {
  const { id } = req.params;
  Card.findById(id)
    .then((cards) => {
      if (!cards) {
        next(new NotFoundError('Переданы некорректные данные для постановки лайка'));
      }
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
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  deleteLikeCardById,
  updateLikesCardById,
};
