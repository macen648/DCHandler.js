const { clientDefaults } = require('./utils/DefaultValues')
const MessageHandler = require('./MessageHandler')
const { DCH_ERROR } = require('./utils/ERROR')
const Registry = require('./Registry')
const dotenv = require('dotenv')
const Ready = require('./Ready')
const path = require('path')
const { FLogs } = require('formatted-logs')
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

        this.EX_package = require(path.join(require.main.path, './', 'package.json'))

        this.DCH_package = require('../package.json')

        this._cli()

        this.loadConfig(config)  

        if (this.options.MongoDB){
            this.db = new db(this.options)
            this.db.login(this.options.MongoURI)
            this.db.ready()
        }

        this.FLogs = new FLogs().addOptions({ hide: this.options.hideOutput })

        DiscordClient.DCHandler = this

        this._start()
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
        const _FLogs = new FLogs().addOptions({ hide: this.options.hideOutput })
       _FLogs.addOptions({ hide: !this.options.debug })
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
                _FLogs.info("Loaded .env into options.")
                loadedOptions = { ...loadedOptions, ...result.parsed }
            }
            else _FLogs.warn(".env is empty.")
        } 

        //custom object
        if (typeof config === 'object'){
            this.addOptions(config)
            _FLogs.info(`Loaded constructor into options.`)
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
     * Console.Log handler stats.
     * @returns Client
     */
    stats() {
        this.FLogs.log('', 'STATS', '#cccccc')
            .newLine(`${this.EX_package.name} v${this.EX_package.version}`)
            .newLine(`Default prefix: ${this.options.PREFIX}`)
            .newLine(`Command count: ${this.DiscordClient.commands.size}\nEvent count: ${this.DiscordClient.eventCount}`)
            .newLine(`Up time: ${this.DiscordClient.uptime}\nPing: ${this.DiscordClient.ws.ping} ms`)
            .log('', 'STATS', '#cccccc')
        return this

    }

    /**
     * Console.Log handler version.
     * @returns Client
     */
    version() {
        this.FLogs.log(`DCH: v${this.DCH_package.version}`)
        return this
    }

    /**
     * Console.Log project versions.
     * @returns Client
     */
    versions() {
        this.FLogs.log('', 'VERSION', '#cccccc',)
            .newLine(`DCH: v${this.DCH_package.version}`)
            .newLine(`Discord.js: v${this.EX_package.dependencies["discord.js"]}`)
            .newLine(`Node: ${process.version}`)
            .newLine(`Package ${this.EX_package.name}: v${this.EX_package.version}`)
            .log('', 'VERSION', '#cccccc',)
        return this
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
                new FLogs().log(`DCH: v${this.DCH_package.version}`)
            }else if (process.argv[i] === '--p-v' || process.argv[i] === '--project-versions') {
                new FLogs().log('', 'VERSION', '#cccccc',)
                    .newLine(`DCH: v${this.DCH_package.version}`)
                    .newLine(`Discord.js: v${this.EX_package.dependencies["discord.js"]}`)
                    .newLine(`Node: ${process.version}`)
                    .newLine(`Package ${this.EX_package.name}: v${this.EX_package.version}`)
                    .log('', 'VERSION', '#cccccc',)
            }
        }

    }

/**
 * @api private 
 */
    _start(){
        this.FLogs.log('🚀 Starting bot...')

        this.Registry = new Registry(this.DiscordClient, this.options.commandPath, this.options)

        this.Registry.loadCommands()
        if (this.options.eventPath) this.Registry.loadEvents()

        if (this.options.ignoreWarnings == false && this.Registry.commandWarnings != 0 || this.Registry.eventWarnings != 0) this.FLogs.info('To view warnings use (--debug) or remove this message with (--ignore-warnings)', !this.options.debug)

        this.MessageHandler = new MessageHandler(this.DiscordClient, this.options).listen()

        this.Ready = new Ready(this.DiscordClient, this.options)   
    }

    /**
     * @api private 
     */
    _loadJsonToOptions(path, file){
        const Flogs = new FLogs().addOptions({ hide: this.options.hideOutput })
        var config
        try {
            config = require(path)
            if (Object.keys(config).length !== 0) {
                if (config.Handler){
                    this.addOptions(config.Handler)
                    config = config.Handler
                } 
                else this.addOptions(config)
                Flogs.info(`Loaded ${file}.json into options.`)
            }
            else Flogs.warn(`${file}.json is empty.`)
        } catch (error) {
            Flogs.warn(`Had an error trying to load Path: ${path} File: ${file} (Likely empty).`)
        }
        return config
    }

}

module.exports = Client