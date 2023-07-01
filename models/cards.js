const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
    link: {
        type: String,
        validate: {
            validator: function (v) {
                return /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: true
    },
    owner: {
        type: ObjectId,
        required: true
    },
    likes: [
        {
            type: ObjectId,
            default: []
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('card', cardSchema);