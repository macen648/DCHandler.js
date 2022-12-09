import mongoose from 'mongoose'

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

export default mongoose.model('guild', guildSchema)