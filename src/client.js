const CommandLoader = require('./loader')
const MessageHandler = require('./messageHandler')
const Ready = require('./ready')
const Log = require('./log')

class Client{

    constructor(client, options = {}){

        this.Log = new Log(options)

        if(!client) this.Log.error('Client', "Missing Discord Client.") 
        if(!options) this.Log.error('Client', "Missing options.") 
        if(!options.commandPath) this.Log.error('CommandPath',`is missing. Specify command directory: 'commandPath': "" in options.`) 
        if(options.mongoPath == "") this.Log.error('MongoPath', `is empty. If you wish to not use DB, Remove 'mongoPath':"" from options. If this is an error check to see if mongo URI is correct.`) 
        if(options.eventPath == "") this.Log.error('EventPath', `is empty. If you wish to not use events, Remove 'eventPath':"" from options. If this is an error check to see if path is correct. Maybe missing a directory?`) 
        
        if (!options.PREFIX) {
            options.PREFIX = "$"
            this.Log.info(`No PREFIX was specified, Defaulting to "$"`)
        }
        
        // start options
        // TODO: allow for any handler options to be toggled through command line
        for (var i = 0; i < process.argv.length; i++){
            if (process.argv[i] === '-prefix') {
                if (process.argv[i+1]) {
                    options.PREFIX = process.argv[i + 1]
                    this.Log.info(`Command line forced prefix to "${process.argv[i + 1]}"`)
                }
            }
        }


        if (!options.mongoPath) this.Log.info(`🚫💾 Not using mongo`)

        if (!options.customActivity) options.customActivity = { name: 'dchandler', type: 'PLAYING' }

        this.CommandLoader

        this.MessageHandler

        this.Ready

        this.client = client

        this.options = options

        client.handlerOptions = options

        this.Log.message('🚀 Starting bot...')

        this.CommandLoader = new CommandLoader(this.client, this.options.commandPath, this.options)

        this.CommandLoader.loadCommands()
        if(this.options.eventPath) this.CommandLoader.loadEvents()
        
        this.MessageHandler = new MessageHandler(this.client, this.options)
        this.MessageHandler.listen()

        this.Ready = new Ready(this.client, this.options)   
        
    }
}

module.exports = Client