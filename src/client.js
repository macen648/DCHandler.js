import dotenv from 'dotenv'
import FLogs, { FParagraph } from 'formatted-logs'
import MessageHandler from './MessageHandler.js'
import Registry from './Registry.js'
import Ready from './Ready.js'
import db from './db.js'
import { clientDefaults } from './utils/DefaultValues.js'
import { DCH_ERROR } from './utils/ERROR.js'
import path from 'path'
import fs from 'fs'

export default class Client {
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

        this.Main_package = JSON.parse(fs.readFileSync(path.join(process.argv[1], './', 'package.json')))

        this.DCH_package = JSON.parse(fs.readFileSync('./package.json'))

        this._cli()

        this.loadConfig(config)  

        if (this.options.MongoDB){
            this.db = new db(this.options)
            this.db.login(this.options.MongoURI)
            this.db.ready()
        }

        FLogs.addOptions({ hide: this.options.hideOutput })

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
        const defaultConfigPath = path.join(process.argv[1], './', `${clientDefaults.ConfigFile}.json`)

        var loadedOptions = {}

        //custom config.json
        if (typeof config === 'string') {
            const customConfigPath = path.join(process.argv[1], './', `${config}.json`)
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
                FLogs.info("Loaded .env into options.")
                loadedOptions = { ...loadedOptions, ...result.parsed }
            }
            else FLogs.warn(".env is empty.")
        } 

        //custom object
        if (typeof config === 'object'){
            this.addOptions(config)
            FLogs.info(`Loaded constructor into options.`)
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
        FParagraph.boxed().title('STATS')
                  .body(
`${this.Main_package.name} v${this.Main_package.version}
Default prefix: ${this.options.PREFIX}
Command count: ${this.DiscordClient.commands.size}\nEvent count: ${this.DiscordClient.eventCount}
Up time: ${this.DiscordClient.uptime}\nPing: ${this.DiscordClient.ws.ping} ms`
                 ).footer('STATS')
        return this
    }

    /**
     * Console.Log handler version.
     * @returns Client
     */
    version() {
        FLogs.log(`DCH: v${this.DCH_package.version}`)
        return this
    }

    /**
     * Console.Log project versions.
     * @returns Client
     */
    versions() {
        FParagraph.boxed().title('VERSION')
                  .body(
`DCH: v${this.DCH_package.version}
Discord.js: v${this.Main_package.dependencies["discord.js"]}
Node: ${process.version}
Package ${this.Main_package.name}: v${this.Main_package.version}`
                 ).footer('VERSION')
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
                FLogs.log(`DCH: v${this.DCH_package.version}`)
            }else if (process.argv[i] === '--p-v' || process.argv[i] === '--project-versions') {
                FParagraph.boxed().title('VERSION')
                          .body(
`DCH: v${this.DCH_package.version}
Discord.js: v${this.Main_package.dependencies["discord.js"]}
Node: ${process.version}
Package ${this.Main_package.name}: v${this.Main_package.version}`
                         ).footer('VERSION')
            }
        }
    }

/**
 * @api private 
 */
    _start(){
        FLogs.log('🚀 Starting bot...')
        this.Registry = new Registry(this.DiscordClient, this.options.commandPath, this.options)

        this.Registry.loadCommands()
        if (this.options.eventPath) this.Registry.loadEvents()

        if (this.options.ignoreWarnings == false && this.Registry.commandWarnings != 0 || this.Registry.eventWarnings != 0) FLogs.info('To view warnings use (--debug) or remove this message with (--ignore-warnings)')

        this.MessageHandler = new MessageHandler(this.DiscordClient, this.options).listen()

        this.Ready = new Ready(this.DiscordClient, this.options)   
    }

    /**
     * @api private 
     */
    _loadJsonToOptions(path, file){
        var config
        try {
            config = JSON.parse(fs.readFileSync(path))
            if (Object.keys(config).length !== 0) {
                if (config.Handler){
                    this.addOptions(config.Handler)
                    config = config.Handler
                } else this.addOptions(config)
                FLogs.info(`Loaded ${file}.json into options.`)
            }
            else FLogs.warn(`${file}.json is empty.`)
        } catch (error) {
            FLogs.warn(`Had an error trying to load Path: ${path} File: ${file} (Likely empty).`)
        }
        return config
    }

}

