const CommandLoader = require('./loader')
const MessageHandler = require('./messageHandler')
const Ready = require('./ready')
const Log = require('./utils/DCH_log')

class Client{

    constructor(client, options = {}){
        if(!client) this.Log.error('Client', "Missing Discord Client.") 
        if(!options) this.Log.error('Client', "Missing options.") 
        if(!options.commandPath) this.Log.error('CommandPath',`is missing. Specify command directory: 'commandPath': "" in options.`) 

        if (!options.PREFIX) {
            options.PREFIX = "$"
            new Log(options).info(`No prefix was specified, Defaulting to "$"`)
        }
        
        if (!options.customActivity) options.customActivity = { name: 'dchandler', type: 'PLAYING' }

        this.CommandLoader

        this.MessageHandler

        this.Ready

        this.client = client

        this.options = options

        client.handlerOptions = options

        new Log(options).info('🚀 Starting bot...')

        this.CommandLoader = new CommandLoader(this.client, this.options.commandPath, this.options)

        this.CommandLoader.loadCommands()
        if(this.options.eventPath) this.CommandLoader.loadEvents()
        
        this.MessageHandler = new MessageHandler(this.client, this.options)
        this.MessageHandler.listen()

        this.Ready = new Ready(this.client, this.options)   
        
    }
}

module.exports = Client