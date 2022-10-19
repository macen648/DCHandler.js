const MessageHandler = require('./MessageHandler')
const { DCH_ERROR } = require('./utils/DCH_ERROR')
const Registry = require('./Registry')
const Ready = require('./Ready')
const Info = require('./utils/DCH_Info')
const path = require("path")
const Log = require('./utils/DCH_Log')
const fs = require('fs')

const DEFAULT = {
    CommandFolder: 'commands',
    ConfigFile: 'config',
    PREFIX: '$'
}

class Client {
    /**
     * The heart of dchandler.
     * 
     * Initializes a new dchandler client.
     * 
     * @param {DiscordClient} [DiscordClient] Discord Client.
     * @param {String | object } [config] Config Object or File.
     * 
     * If no param is given loadConfig will try and load './config.json' by deafult.
     * If unable to locate config.json / config.json doesnt include "HANDLER": {...}).
     * Deafult values will be loaded instead.
     * If config file is loaded, values will be overwritten by any values passed in as an object.
     * @default - PREFIX '$'
     * @default - CommandPath 'commands'
     */
    constructor(DiscordClient, config){
        if (!DiscordClient) throw new DCH_ERROR(`Missing Discord Client`, '1', "MISSING_DISCORD_CLIENT") 
        
        this.options = {}

        this.Registry

        this.MessageHandler

        this.Ready

        this.DiscordClient = DiscordClient

        this.loadConfig(config)  

        this._cli()

        this.Log = new Log().addOptions({ hide: this.options.hideOutput })

        DiscordClient.DCHandler = this

        this._start()
    }

    /**
     * Prints handler info.
     * @returns this
     */
    info(){
        new Info(this).all()
        return this
    }

    /**
     * Prints handler stats.
     * @returns this
     */
    stats(){
        new Info(this).stats()
        return this
    }

    /**
     * Adds an option or options to options.
     * @param {object} _options 
     * @returns this
     */
    addOptions(_options){
        this.options = { ...this.options, ..._options }
        return this
    }

    /**
     * Loads config file or config object.
     * 
     * @param {object | string} [_config] - Config object or file that is loaded into options.
     * 
     * If no param is given loadConfig will try and load './config.json' by deafult.
     * If unable to locate config.json / config.json doesnt include "HANDLER": {...}).
     * Deafult values will be loaded instead.
     * If config file is loaded, values will be overwritten by any values passed in as an object.
     * 
     * @default - PREFIX '$'
     * @default - CommandPath 'commands'
     * 
     * @returns this
     */
    loadConfig(_config){
        var configPath = path.join(require.main.path, './', `${DEFAULT.ConfigFile}.json`)

        if(typeof _config === 'object') {
            if (fs.existsSync(configPath) == true) {
                const config = require(configPath)
                if (config.Handler) this.options = config.Handler
            } 
            this.addOptions(_config)
        } else {
            if (_config) {
                configPath = path.join(require.main.path, './', `${_config}.json`)
                if (fs.existsSync(configPath) == false) {
                    throw new DCH_ERROR(`Unable to locate config file, PATH: ${configPath}`, '1', "MISSING_CONFIG")
                } else {
                    const config = require(configPath)
                    if (config.Handler) this.options = config.Handler
                    else throw new DCH_ERROR(`Unable to load config, Missing Handler object ("HANDLER": {...})`, '1', "MISSING_HANDLER_OBJECT")
                }
            } else {
                if (fs.existsSync(configPath) == true) {
                    const config = require(configPath)
                    if (config.Handler) this.options = config.Handler
                } 
            }
        }
    
        if (!this.options.commandPath) this.options.commandPath = DEFAULT.CommandFolder

        if (fs.existsSync(path.join(require.main.path, this.options.commandPath)) == false) throw new DCH_ERROR(`Unable to locate commands folder.\nPATH: '${path.join(require.main.path, this.options.commandPath)}' \nFOLDER: '${this.options.commandPath}'`, '1', "WRONG_COMMAND_FOLDER_PATH")

        if (!this.options.PREFIX) this.options.PREFIX = DEFAULT.PREFIX

        return this
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