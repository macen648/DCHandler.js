const MessageHandler = require('./MessageHandler')
const Registry = require('./Registry')
const Ready = require('./Ready')
const Info = require('./utils/DCH_Info')
const Log = require('./utils/DCH_Log')

class Client{
    constructor(_DiscordClient, options = {}){
        if(!_DiscordClient) console.log('Missing Discord Client.') 
        if(!options) console.log('Missing options.') 

        this.Log = new Log()

        if (!options.commandPath) console.log('is missing. Specify command directory: \'commandPath\': "" in options.') 

        if (!options.PREFIX) {
            options.PREFIX = "$"
            this.Log.info('No prefix was specified, Defaulting to "$"')
        }
        
        options.debug = false
        options.ignoreWarnings = false
        
        //temp add proper cli handling
        for (var i = 0; i < process.argv.length; i++) {
            if (process.argv[i] === '--debug') options.debug = true
            else if ((process.argv[i] === '--ignore-warnings')){
                options.ignoreWarnings = true
            }
        }

        this.Registry

        this.MessageHandler

        this.Ready

        this.DiscordClient = _DiscordClient

        this.options = options

        _DiscordClient.DCHandler = this

        if (this.options.debug == true) new Info(this).debug()

        this.Log.message('🚀 Starting bot...')

        this.Registry = new Registry(this.DiscordClient, this.options.commandPath, this.options)

        this.Registry.loadCommands()
        if(this.options.eventPath)this.Registry.loadEvents()
        
        if (this.options.ignoreWarnings == false && this.Registry.commandWarnings != 0 || this.Registry.eventWarnings != 0) this.Log.info('To view warnings use (--debug) or remove this message with (--ignore-warnings)')

        this.MessageHandler = new MessageHandler(this.DiscordClient, this.options).listen()

        this.Ready = new Ready(this.DiscordClient, this.options)   
        
    }

    info(){
        new Info(this).all()
        return this
    }

    stats(){
        new Info(this).stats()
        return this
    }

    addOption(_option){
        this.options = { ...this.options, _option}
        return this
    }


    addOptions(_options) {
        this.options = { ...this.options, ..._options }
        return this
    }

}

module.exports = Client