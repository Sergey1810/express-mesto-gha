const Card = require("../models/cards");

const getCards = (req, res) => {
    return Card.find({})
        .then((cards) => {
            return res.status(200).send(cards);
        })
        .catch((e) => {
            if (e.name === "ValidationError") {
                return res.status(400).send({ message: "Переданы некорректные данные при создании карточки." });
            }
            res.status(500).send({ message: "Произошла ошибка" })
        })
};

const createCard = (req, res) => {
    const newCardData = req.body;
    return Card.create({ ...newCardData, owner: req.user._id })
        .then((newCard) => {
            return res.status(200).send(newCard);
        })
        .catch((e) => {
            if (e.name === "ValidationError") {
                return res.status(400).send({ message: "Переданы некорректные данные при создании карточки." });
            }
            res.status(500).send({ message: 'Произошла ошибка' })
        });
};

const deleteCardById = (req, res) => {
    const { id } = req.params;
    Card.findByIdAndRemove(id)
        .then((card) => {
            res.status(200).send({ data: card })
        })
        .catch((e) => {
            if (e.name === "CastError") {
                return res.status(404).send({ message: `Карточка с указанным ${id} не найдена.` });
            }
            res.status(500).send({ message: 'Произошла ошибка' })
        });
};

const deleteLikeCardById = (req, res) => {
    const { id } = req.params;
    Card.findByIdAndUpdate(
        id,
        { $pull: { likes: req.user._id } },
        { new: true },)
        .then((card) => {
            return res.status(200).send(card);
        })
        .catch((e) => {
            if (e.name === "ValidationError") {
                return res.status(400).send({ message: "Переданы некорректные данные для постановки/снятии лайка." });
            } else if (e.name === "CastError") {
                return res.status(404).send({ message: `Передан несуществующий ${id} карточки.` });
            }
            res.status(500).send({ message: 'Произошла ошибка' })
        });
};

const updateLikesCardById = (req, res) => {
    const { id } = req.params;
    Card.findByIdAndUpdate(
        id,
        { $addToSet: { likes: req.user._id } },
        { new: true })
        .then((card) => {
            return res.status(200).send(card);
        })
        .catch((e) => {
            if (e.name === "ValidationError") {
                return res.status(400).send({ message: "Переданы некорректные данные для постановки/снятии лайка." });
            } else if (e.name === "CastError") {
                return res.status(404).send({ message: `Передан несуществующий ${id} карточки.` });
            }
            res.status(500).send({ message: 'Произошла ошибка' })
        });
};

module.exports = {
    getCards,
    createCard,
    deleteCardById,
    deleteLikeCardById,
    updateLikesCardById
}