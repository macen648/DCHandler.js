const { DCH_LOAD_ERROR } = require('./utils/ERROR')
const { formatMS } = require('./utils/formatMS')
const Discord = require('discord.js')
const path = require("path")
const { FLogs } = require('formatted-logs')
const fs = require("fs")

class Registry {
    /**
     * Loads **command** and **event** files.
     * 
     * @param {DiscordClient} [client] Discord Client
     * @param {string} [commandPath] Commands Path
     * @param {object} options Options
     */
    constructor(client, commandPath, options = {}){
        
        this.client = client

        this.client.commands = new Discord.Collection()

        this.FLog = new FLogs().addOptions({ debug: options.debug, hide: options.hideOutput })

        this.options = options

        this.commandPath = commandPath

        this.eventPath = options.eventPath

        this.commandWarnings = 0

        this.eventWarnings = 0
    }   

/**
 * @api private 
 */
    loadCommands(){
        var startTime = performance.now()

        this.FLog.log(`Loading commands...`)

        const result = this.registerDirectory(this.commandPath, this.registerCommand)

        if (result.status === "Error"){
            new DCH_LOAD_ERROR(`No commands loaded.`)
            return result
        } 

        if(result.status === "empty"){
            this.FLog.warn(`Commands folder is empty.\nNo commands loaded.`)
            return result
        } 

        this.FLog.log(`Commands loaded in ${formatMS(performance.now() - startTime)}\n`)
        if (this.commandWarnings != 0 && this.options.ignoreWarnings == false || this.options.debug == true) this.FLog.warn(`Loaded with ${this.commandWarnings} warnings!`)

        return result
    }

/**
 * @api private 
 */
    registerCommand(file, _filePath, _this) {
        _this.FLog.addOptions({ hide: !_this.options.debug })
        const filePath = path.join(require.main.path, _filePath, file)

        var command = require(filePath)

        try {
            if (Object.keys(command).length === 0){
                _this.commandWarnings++
                _this.FLog.warn(`Command file '${file}' isn't correct (Missing Command Structure).\nSkipping.`)
                return 
            } 

            if (!command.name) Object.assign(command, { name: file.split('.')[0] })

            if(command.name.includes(" ")){
                command.name = command.name.replace(/ /g, "_")
                _this.commandWarnings++
                _this.FLog.warn(`Command file '${file}' name contains spaces.\nConverted to '${command.name}'.`)
            } 

            if (_this.client.commands.some(cmds => cmds.name === command.name)) {
                _this.FLog.log(` -> Command with the name ${command.name.toLowerCase()} already exists, Loaded anyways.`, 'CMD', '#fff100')
                _this.commandWarnings++
                return _this.client.commands.set(command.name.toLowerCase(), command)
            }

            _this.client.commands.set(command.name.toLowerCase(), command)
            _this.FLog.log(` -> Loaded command '${command.name.toLowerCase()}'`, 'CMD', '#00FF00')

        } catch (error) {
            new DCH_LOAD_ERROR(`Command file '${file.split('.')[0]}' Had a error loading.\n${error}`)
        }

        delete require.cache[require.resolve(path.join(require.main.path, _filePath, file))]

        _this.FLog.addOptions({ hide: false })

        return command
    }

/**
 * @api private 
 */
    loadEvents(){
        var startTime = performance.now()

        this.client.eventCount = 0

        this.FLog.log(`Loading events...`)

        const result = this.registerDirectory(this.eventPath, this.registerEvent)

        if (result.status === "Error") {
            new DCH_LOAD_ERROR(`No events loaded.`)
            return result
        } 


        if(result.status === "empty"){
            this.FLog.warn(`Event folder is empty.\nNo commands loaded.`)
            return result
        }  

        this.FLog.log(`Events loaded in ${formatMS(performance.now() - startTime)}`)
        if (this.eventWarnings != 0 && this.options.ignoreWarnings == false || this.options.debug == true) this.FLog.warn(`Loaded With ${this.commandWarnings} warnings!`)
        return result
    }  

/**
 * @api private 
 */    
    registerEvent(file, _filePath, _this) {
        _this.FLog.addOptions({ hide: !_this.options.debug })
        const filePath = path.join(require.main.path, _filePath, file)

        var event = require(filePath)

        try {
            _this.client.on(file.split('.')[0], event.bind(null, _this.client))
            _this.client.eventCount++
            _this.FLog.log(` -> Loaded event '${file.split('.')[0]}'`, 'EVNT', '#00FF00')

        } catch (error) {
            new DCH_LOAD_ERROR(`Event file '${file.split('.')[0]}' Had a error loading.\n${error}`)
        }

        delete require.cache[require.resolve(path.join(require.main.path, _this.eventPath, file))]

        _this.FLog.addOptions({ hide: false })
        return event
    }

/**
 * @api private 
 */
    registerDirectory(path, registerFile) {
        try {
            function registerSubDirectories(path, _this) {
                _this.FLog.addOptions({ hide: _this.options.debug })
                const dirs = fs.readdirSync(path, { withFileTypes: true }).filter(item => item.isDirectory()).map(item => item.name)
                if (!dirs) return

                for (const dir of dirs) {
                    if (fs.readdirSync(`${path}/${dir}`) == '') {
                        _this.commandWarnings++
                        return _this.FLog.warn(`Folder ${dir} is empty.`)
                    }
                    registerSubDirectories(`${path}/${dir}`, _this)
                    fs.readdirSync(`${path}/${dir}`).filter(file => file.endsWith(".js")).forEach(file => {
                        registerFile(file, `${path}/${dir}`, _this)
                    })
                }
                
            }

            if (fs.readdirSync(path) == '') return { status: "empty" }

            fs.readdirSync(`${path}`).filter(file => file.endsWith(".js")).forEach(file => { registerFile(file, `${path}`, this) })

            registerSubDirectories(path, this)

            this.FLog.addOptions({ hide: false })

            return { status: "success", commandWarnings: this.commandWarnings, eventWarnings: this.eventWarnings }
        } catch (error) {
            new DCH_LOAD_ERROR(`Directory: '${path}' had a Error loading. (Check spelling)`)
            new DCH_LOAD_ERROR(`${error}`)
            return { status: "Error", commandWarnings: this.commandWarnings, eventWarnings: this.eventWarnings }
        }
    }
}

module.exports = Registry