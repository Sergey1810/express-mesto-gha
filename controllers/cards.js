const Card = require("../models/cards");
const ForbiddenError = require("../errors/forbidden-error");
const InternalServerError = require("../errors/internal-server-error");

const cardsBadRequestError = (e, res) => {
    if (e.name === "ValidationError") {
        return res.status(400).send({ message: "Переданы некорректные данные при создании карточки." });
    } else if (e.name === "CastError") {
        return res.status(400).send({ message: `Карточка с указанным ${id} не найдена.` });
    }
    throw new InternalServerError()
}

const cardNotFoundError = (card) => {
    if (!card) {
        return res.status(404).send({ message: `Карточка с указанным ${id} не найдена.` });
    }
    return res.status(200).send(card);
}

const getCards = (req, res) => {
    return Card.find({})
        .then((cards) => {
            return res.status(200).send(cards);
        })
        .catch((e) => {
            cardsBadRequestError(e, res)
        })
};

const createCard = (req, res) => {
    const owner = req.user.id
    const newCardData = req.body;
    return Card.create({ ...newCardData, owner: owner })
        .then((newCard) => {
            return res.status(200).send(newCard);
        })
        .catch((e) => {
            cardsBadRequestError(e, res)
        });
};

const deleteCardById = (req, res) => {
    const owner = req.user._id
    const { id } = req.params;
    const card = Card.findById(id)
        .then((card) => {
            cardNotFoundError(card)
        })
        .catch((e) => {
            throw new InternalServerError()
        })

    if (card.owner !== owner) {
        throw new ForbiddenError("Переданы некорректные данные при удалении карточки.")
    }
    return Card.findByIdAndRemove(id)
        .then((card) => {
            res.status(200).send({ data: card })
        })
        .catch((e) => {
            cardsBadRequestError(e, res)
        })
}

const deleteLikeCardById = (req, res) => {
    const { id } = req.user.id;
    return Card.findByIdAndUpdate(
        id,
        { $pull: { likes: req.user._id } },
        { new: true },)
        .then((card) => {
            cardNotFoundError(card)
        })
        .catch((e) => {
            cardsBadRequestError(e, res)
        });
};

const updateLikesCardById = (req, res) => {
    const { id } = req.user.id;
    return Card.findByIdAndUpdate(
        id,
        { $addToSet: { likes: req.user.id } },
        { new: true })
        .then((card) => {
            cardNotFoundError(card)
        })
        .catch((e) => {
            cardsBadRequestError(e, res)
        });
};

module.exports = {
    getCards,
    createCard,
    deleteCardById,
    deleteLikeCardById,
    updateLikesCardById
}