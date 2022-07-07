const mongoose = require('mongoose')

const guildSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    PREFIX: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('guild', guildSchema)