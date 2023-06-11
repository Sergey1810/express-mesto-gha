const Card = require("../models/Card");

const getCards = (req, res) => {
    return Card.find({})
        .then((cards) => {
            return res.status(200).send(cards);
        })
        .catch((e) => {
            res.status(500).send({
                "message": "Запрашиваемый пользователь не найден"
              })
        })
};

const createCard = (req, res) => {
    const newCardData = req.body;
    return Card.create(newCardData)
        .then((newCard) => {
            return res.status(201).send(newCard);
        })
        .catch((err) => {
            if (err.name === "ValidationError") {
                return res.status(400).send({
                    message: `${Object.values(err.errors).map((err) => err.message).join(", ")}`
                });
            }
            return res.status(500).send({message: "Server Error"});
        })
};

const deleteCardById = (req, res) => {
};

const deleteLikeCardById = (req, res) => {
};

const updateLikesCardById = (req, res) => {
};

module.exports = {
    getCards,
    getUserById,
    createCard,
    deleteCardById,
    deleteLikeCardById,
    updateLikesCardById
}