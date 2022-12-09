import FLogs from 'formatted-logs'
import { DCH_DB_ERROR } from './utils/ERROR.js'
import guildSchema from './models/guild.js'

import mongoose from 'mongoose'


export default class db {
    /**
     * Wrapper for basic mongoose functions.
     * 
     * @param {object} options Options
     */
    constructor(options = {}){

        this.options = options

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
        FLogs.log(`Connecting to MongoDB...`, 'DB', '#00FF00')
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
            FLogs.log(`Connecting to MongoDB`, 'DB', '#cccccc')
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
            FLogs.log(`Connected to MongoDB`, 'DB', '#00FF00')
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
            FLogs.log( `Disconnecting from MongoDB`, 'DB', '#00FF00')
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
            FLogs.log(`Disconnected from MongoDB`, 'DB', '#cccccc')
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
            FLogs.log('Unable to curl MongoDB (Likely not connected?)', 'DB', '#FF0000')
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
            FLogs.log('Unable to curl MongoDB (Likely not connected?)', 'DB', '#FF0000',)
        })
        return result ? result.PREFIX : undefined
    }

}
