const MessageHandler = require('./MessageHandler')
const { DCH_ERROR } = require('./utils/DCH_ERROR')
const Registry = require('./Registry')
const Ready = require('./Ready')
const Info = require('./utils/DCH_Info')
const path = require("path")
const Log = require('./utils/DCH_Log')
const fs = require('fs')

class Client{
    constructor(DiscordClient, config){
        if (!DiscordClient) throw new DCH_ERROR(`Missing Discord Client`, '1', "MISSING_DISCORD_CLIENT") 
        
        this.options

        this.loadConfig(config)      

        this.Registry

        this.MessageHandler

        this.Ready

        this.DiscordClient = DiscordClient

        this._cli()

        this.Log = new Log().addOptions({ hide: this.options.hideOutput })

        DiscordClient.DCHandler = this

        this._start()
    }

    info(){
        new Info(this).all()
        return this
    }

    stats(){
        new Info(this).stats()
        return this
    }

    addOptions(_options){
        this.options = { ...this.options, ..._options }
        return this
    }

    loadConfig(_config){
        if(typeof _config === 'object')this.options = _config
        else {
            var configPath = path.join(require.main.path, './', `config.json`)
            if (_config) configPath = path.join(require.main.path, './', `${_config}.json`)

            if (fs.existsSync(configPath) == false) throw new DCH_ERROR(`Unable to locate config file, PATH: ${configPath}`, '1', "MISSING_CONFIG")
            const config = require(configPath)
            if (config.Handler) this.options = config.Handler
            else throw new DCH_ERROR(`Unable to load config, Missing Handler object ("HANDLER": {...})`, '1', "MISSING_HANDLER_OBJECT")
        }

        if (!this.options.commandPath) throw new DCH_ERROR('CommandPath is missing. Specify command directory: \'commandPath\': "" in options', '1', "MISSING_COMMAND_PATH")

        if (!this.options.PREFIX) {
            this.options.PREFIX = "$"
            new Log().message('[CONFIG] No prefix was specified, Defaulting to "$"')
        }

    }

/**
 * @api private 
 */
    _cli(){
        this.options.debug = false
        this.options.ignoreWarnings = false

        for (var i = 0; i < process.argv.length; i++) {
            if (process.argv[i] === '--debug') this.options.debug = true
            else if (process.argv[i] === '--ignore-warnings') {
                this.options.ignoreWarnings = true
            } else if (process.argv[i] === '--clear') {
                this.options.hideOutput = true
            }
        }

    }

/**
 * @api private 
 */
    _start(){
        if (this.options.debug == true) new Info(this).debug()

        this.Log.message('🚀 Starting bot...')

        this.Registry = new Registry(this.DiscordClient, this.options.commandPath, this.options)

        this.Registry.loadCommands()
        if (this.options.eventPath) this.Registry.loadEvents()

        if (this.options.ignoreWarnings == false && this.Registry.commandWarnings != 0 || this.Registry.eventWarnings != 0) this.Log.info('To view warnings use (--debug) or remove this message with (--ignore-warnings)', !this.options.debug)

        this.MessageHandler = new MessageHandler(this.DiscordClient, this.options).listen()

        this.Ready = new Ready(this.DiscordClient, this.options)   
    }
}

module.exports = Client