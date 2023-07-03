const mongoose = require('mongoose');
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 30,
        default: 'Жак-Ив Кусто'
    },
    email: {
        type: String,
        validate: [validator.isEmail, 'Некорректный email'],
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        minlength: 2,
        maxlength: 30,
        default: 'Исследователь'
    },
    avatar: {
        type: String,
        validate: {
            validator: function (v) {
                return /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'
    }
});

module.exports = mongoose.model('user', userSchema);

