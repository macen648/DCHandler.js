const MessageHandler = require('./MessageHandler')
const Registry = require('./Registry')
const Ready = require('./Ready')
const Info = require('./utils/DCH_Info')
const Log = require('./utils/DCH_Log')





class Client{

    constructor(_DiscordClient, options = {}){
        if(!_DiscordClient) console.log('Missing Discord Client.') 
        if(!options) console.log('Missing options.') 

        this.Log = new Log(options)

        if (!options.commandPath) console.log('is missing. Specify command directory: \'commandPath\': "" in options.') 

        if (!options.PREFIX) {
            options.PREFIX = "$"
            this.Log.info('No prefix was specified, Defaulting to "$"')
        }
        
        this.Registry

        this.MessageHandler

        this.Ready

        this.DiscordClient = _DiscordClient

        this.options = options

        _DiscordClient.handlerOptions = options

        this.Log.message('🚀 Starting bot...')

        this.Registry = new Registry(this.DiscordClient, this.options.commandPath, this.options)

        this.Registry.loadCommands()
        if(this.options.eventPath) this.Registry.loadEvents()
        
        this.MessageHandler = new MessageHandler(this.DiscordClient, this.options)
        this.MessageHandler.listen()

        this.Ready = new Ready(this.DiscordClient, this.options)   
        
    }

    info(){
        new Info(this)
    }

}

module.exports = Client