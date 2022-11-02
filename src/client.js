const { clientDefaults } = require('./utils/DefaultValues')
const MessageHandler = require('./MessageHandler')
const { DCH_ERROR } = require('./utils/ERROR')
const Registry = require('./Registry')
const dotenv = require('dotenv')
const Ready = require('./Ready')
const path = require("path")
const Log = require('./utils/Log')
const fs = require('fs')
const db = require('./db')

class Client {
    /**
     * The heart of **DCHandler**.
     * 
     * Initializes a new **DCHandler** Client.
     * 
     * @param {DiscordClient} DiscordClient Discord Client
     * @param {String | object | undefined} [config] 
     *  
     * If no config param is given, **loadConfig()** will try and load **'./config.json'** or **.env** by default.
     * 
     * If unable to locate **config.json** or **.env** default values will be loaded instead.
     * 
     * If a **config.json** or **.env** is loaded, values will be overwritten by any values passed in as an **Object**.
     * 
     * If a **config.json** and **.env** are loaded, **.env** will overwrite **config.json** values.
     * 
     * @default - PREFIX '$'
     * @default - CommandPath 'commands'
     */
    constructor(DiscordClient, config){
        if (!DiscordClient) throw new DCH_ERROR(`Missing Discord Client`, '1', "MISSING_DISCORD_CLIENT") 
        this.options = {}

        this.db

        this.Registry

        this.MessageHandler

        this.Ready

        this.DiscordClient = DiscordClient

        this._version = require('../package.json').version

        this._cli()

        this.loadConfig(config)  

        if (this.options.MongoDB){
            this.db = new db(this.options)
            this.db.login(this.options.MongoURI)
            this.db.ready()
        }

        this.Log = new Log().addOptions({ hide: this.options.hideOutput })

        DiscordClient.DCHandler = this

        this._start()
    }

    /**
     * Console.Log handler stats.
     * @returns Client
     */
    stats(){
        this.Log.stats(this)
        return this
    }

    /**
     * Console.Log handler version.
     * @returns Client
     */
    version(){
        this.Log.message(`DCH: v${this._version}`)
        return this
    }

    /**
     * Console.Log project versions.
     * @returns Client
     */
    versions(){
        this.Log.versions()
        return this
    }

    /**
     * Adds an option or options to options.
     * @param {object} _options 
     * @returns Client
     */
    addOptions(_options){
        this.options = { ...this.options, ..._options }
        return this
    }

    /**
     * Loads / reloads **config file** and **.env** or load a new config **object**.
     * 
     * @param {object | string} [config] 
     * 
     * If no config param is given, **loadConfig()** will try and load **'./config.json'** or **.env** by default.
     * 
     * If unable to locate **config.json** or **.env** default values will be loaded instead.
     * 
     * If a **config.json** or **.env** is loaded, values will be overwritten by any values passed in as an **Object**.
     * 
     * If a **config.json** and **.env** are loaded, **.env** will overwrite **config.json** values.
     * 
     * @default - PREFIX '$'
     * @default - CommandPath 'commands'
     * 
     * @returns loaded options
     */
    loadConfig(config) {
        const _Log = new Log().addOptions({ hide: this.options.hideOutput })
        const defaultConfigPath = path.join(require.main.path, './', `${clientDefaults.ConfigFile}.json`)
        var loadedOptions = {}

        //custom config.json
        if (typeof config === 'string') {
            const customConfigPath = path.join(require.main.path, './', `${config}.json`)
            if (fs.existsSync(customConfigPath) == false) throw new DCH_ERROR(`Unable to locate config file, PATH: ${defaultConfigPath}`, '1', "MISSING_CONFIG")
            const result = this._loadJsonToOptions(customConfigPath, config)
            loadedOptions = { ...loadedOptions, ...result }

        //default config.json
        } else if (fs.existsSync(defaultConfigPath) == true){
            const result = this._loadJsonToOptions(defaultConfigPath, clientDefaults.ConfigFile)
            loadedOptions = { ...loadedOptions, ...result }
        } 

        //.env
        const result = dotenv.config()
        if (!result.error) {
            if ((Object.keys(result.parsed).length !== 0)) {
                this.addOptions(result.parsed)
                _Log.info("Loaded .env into options.", this.options.debug)
                loadedOptions = { ...loadedOptions, ...result.parsed }
            }
            else _Log.warn(".env is empty.")
        } 

        //custom object
        if (typeof config === 'object'){
            this.addOptions(config)
            _Log.info(`Loaded constructor into options.`, this.options.debug)
            loadedOptions = { ...loadedOptions, ...config }
        } 
        
        //defaults
        if (!this.options.commandPath){
            this.options.commandPath = clientDefaults.CommandFolder
            loadedOptions = { ...loadedOptions, CommandFolder: clientDefaults.CommandFolder }
        } 

        if (!this.options.PREFIX){
            this.options.PREFIX = clientDefaults.PREFIX
            loadedOptions = { ...loadedOptions, ...clientDefaults.PREFIX }
        } 

        if (this.options.MongoURI){
            this.options.MongoDB = true
            loadedOptions = { ...loadedOptions, ...this.options.MongoDB }
        } 
        return loadedOptions
    }


/**
 * @api private 
 */
    _cli(){
        this.options.debug = false
        this.options.ignoreWarnings = false
        this.options.hideOutput = false
        this.options.MongoDB = false

        for (var i = 0; i < process.argv.length; i++) {
            if (process.argv[i] === '--debug'){
                this.options.debug = true
            } else if (process.argv[i] === '--ignore-warnings') {
                this.options.ignoreWarnings = true
            } else if (process.argv[i] === '--clear') {
                this.options.hideOutput = true
            } else if (process.argv[i] === '--v' || process.argv[i] === '--version') {
                new Log().versions()
            }
        }

    }

/**
 * @api private 
 */
    _start(){
        this.Log.message('🚀 Starting bot...')

        this.Registry = new Registry(this.DiscordClient, this.options.commandPath, this.options)

        this.Registry.loadCommands()
        if (this.options.eventPath) this.Registry.loadEvents()

        if (this.options.ignoreWarnings == false && this.Registry.commandWarnings != 0 || this.Registry.eventWarnings != 0) this.Log.info('To view warnings use (--debug) or remove this message with (--ignore-warnings)', !this.options.debug)

        this.MessageHandler = new MessageHandler(this.DiscordClient, this.options).listen()

        this.Ready = new Ready(this.DiscordClient, this.options)   
    }

/**
 * @api private 
 */
    _loadJsonToOptions(path, file){
        const _Log = new Log().addOptions({ hide: this.options.hideOutput })
        var config
        try {
            config = require(path)
            if (Object.keys(config).length !== 0) {
                if (config.Handler){
                    this.addOptions(config.Handler)
                    config = config.Handler
                } 
                else this.addOptions(config)
                _Log.info(`Loaded ${file}.json into options.`, this.options.debug)
            }
            else _Log.warn(`${file}.json is empty.`)
        } catch (error) {
            _Log.warn(`Had an error trying to load Path: ${path} File: ${file} (Likely empty).`)
        }
        return config
    }
}

module.exports = Client