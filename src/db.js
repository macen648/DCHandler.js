const { DCH_DB_ERROR } = require('./utils/ERROR')
const guildSchema = require('./models/guild')
const mongoose = require("mongoose")
const Log = require('./utils/Log')

class db {
    /**
     * Wrapper for basic mongoose functions.
     * 
     * @param {object} options Options
     */
    constructor(options = {}){

        this.options = options

        this.Log = new Log().addOptions({ hide: this.options.hideOutput })
    }

    /**
     * Adds an option or options to options.
     * @param {object} _options Options
     * @returns db
     */
    addOptions(_options) {
        this.options = { ...this.options, ..._options }
        return this
    }

    /**
     * Wrapper for **db.connect** with a connecting message.
     * 
     * @param {string} MONGO_URI MongoDB URI
     * @returns db
     */
    login(MONGO_URI) {
        this.Log.custom('DB', '#00FF00', `Connecting to MongoDB...`)
        this.connect(MONGO_URI)
        return this
    }

    /**
     * Ready message when connection is successful.
     * 
     * @returns db
     */
    ready() {
        this.onConnected()
        return this
    }

    /**
     * Creates a connection to a **mongoDB** data base.
     * 
     * This connection is global. 
     * 
     * @param {string} MONGO_URI MongoDB URI
     * @returns db
     */
    connect(MONGO_URI){
        mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        this.onError('An error occurred connecting to MongoDB. (check uri)')
        return this
    }

    /**
     * Disconnects the current **mongoDB** connection.
     * 
     * @returns db
     */
    disconnect() {
        mongoose.disconnect()
        this.onError('An error occurred disconnecting from MongoDB')
        return this
    }

    /**
     * Connecting message when **mongoDB** is connecting.
     * 
     * @returns db
     */
    onConnecting(){
        mongoose.connection.on('connecting', () => {
            this.Log.custom('DB', '#00FF00', `Connecting to MongoDB`)
        })
        return this
    }
    /**
     * Connected message when **mongoDB** is connected.
     * 
     * @returns db
     */
    onConnected(){
        mongoose.connection.on('connected', () => {
            this.Log.custom('DB', '#00FF00', `Connected to MongoDB`)
        })
        return this
    }
    /**
     * Disconnecting message when **mongoDB** is disconnecting.
     * 
     * @returns db
     */
    onDisconnecting(){
        mongoose.connection.on('disconnecting', () => {
            this.Log.custom('DB', '#00FF00', `disconnecting from MongoDB`)
        })
        return this
    }

    /**
     * Disconnected message when **mongoDB** has been disconnected.
     * 
     * @returns db
     */
    onDisconnected(){
        mongoose.connection.on('disconnected', () => {
            this.Log.custom('DB', '#cccccc', `Disconnected from MongoDB`)
        })
        return this
    }

    /**
     * Error message(s) when there has been any kind of connection Error.
     * 
     * @returns db
     */
    onError(message){
        mongoose.connection.on('error', (err) => {
            new DCH_DB_ERROR(message)
            new DCH_DB_ERROR(err)
        })
        return this
    }


    /**
     * Set the prefix for the current message's guild.
     * 
     * async function.
     * 
     * @param {string} prefix Given prefix
     * @param {Message} message Discord message
     * @returns result
     */
    async setPrefix(prefix, message){
        const result = await guildSchema.findOneAndUpdate({
            _id: message.guild.id
        }, {
            _id: message.guild.id,
            name: message.guild.name,
            PREFIX: prefix,
        }, {
            upsert: true
        }).catch((err) => {
            this.Log.custom('DB', '#FF0000', 'Unable to curl MongoDB (Likely not connected?)')
        })

        return result ? result : undefined
    }

    /**
     * Get the prefix for the current message's guild.
     * 
     * async function.
     * 
     * @param {Message} message Discord message
     * @returns PREFIX
     */

    async getPrefix(message){
        const result = await guildSchema.findOne({
            _id: message.guild.id
        }).catch((err) => {
            this.Log.custom('DB', '#FF0000', 'Unable to curl MongoDB (Likely not connected?)')
        })
        return result ? result.PREFIX : undefined
    }

}


module.exports = db