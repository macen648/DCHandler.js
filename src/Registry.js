const prettyMilliseconds = require("pretty-ms")
const Discord = require('discord.js')
const path = require("path")
const fs = require("fs")

const Log = require('./utils/DCH_Log')

class Registry {
    constructor(client, commandPath, options = {}){
        
        this.client = client

        this.client.commands = new Discord.Collection()

        this.Log = new Log(options)

        this.options = options

        this.commandPath = commandPath

        this.eventPath = options.eventPath

    }   

    loadCommands(){
        var startTime = performance.now()

        this.Log.message(`Loading commands...`)
        const result = this.registerDirectory(this.commandPath, this.registerCommand)

        if(result === "empty") return this.Log.warn(`Command folder is empty.\nNo commands loaded.`)
        else this.Log.info(`Commands loaded in ${prettyMilliseconds(performance.now() - startTime)}`)

        return result
    }

    loadEvents(){
        var startTime = performance.now()
        this.client.eventCount = 0

        this.Log.message(`Loading events...`)
        const result = this.registerDirectory(this.eventPath, this.registerEvent)

        if(result === "empty") return this.Log.warn(`Event folder is empty.\nNo commands loaded.`)
        else this.Log.info(`Events loaded in ${prettyMilliseconds(performance.now() - startTime)}`)

        return result
    }   

    registerDirectory(path, registerFile) {
        const dir = fs.readdirSync(path).filter(file => file.endsWith(".js"))

        if (fs.readdirSync(path) == '') return "empty"

        var i = 0
        fs.readdirSync(path).forEach(dirs => {

            if (dirs == dir[i]) {
                registerFile(dir[i], path, this)
                return i++
            }

            const files = fs.readdirSync(`${path}/${dirs}`).filter(file => file.endsWith(".js"))

            if (files.length === 0) return this.Log.warn(`Folder ${dirs} is empty.`)

            for (const file of files) registerCommand(file)
        })
        return "success"
    }

    registerCommand(file, _filePath, _this) {
        const filePath = path.join(require.main.path, _filePath, file)

        var command = require(filePath)

        try {
            if (Object.keys(command).length === 0) return _this.Log.warn(`Command file '${file}' isn't correct (Missing Command Structure).\nSkipping.`)
            if (!command.name) Object.assign(command, { name: file.split('.')[0] })

            if (_this.client.commands.some(cmds => cmds.name === command.name)){
                _this.Log.warn(`  -> Command with the name ${command.name.toLowerCase()} already exists, Loaded anyways.`)  
                return _this.client.commands.set(command.name.toLowerCase(), command)
            } 
            
            _this.client.commands.set(command.name.toLowerCase(), command)
            _this.Log.custom('CMD', '#00FF00', ` -> Loaded command '${command.name.toLowerCase()}'`)

        } catch (error) {
            _this.Log.custom('ERROR', '#FF0000', `Command file '${file.split('.')[0]}' Had a error loading.\n${error}`)
        } 

        delete require.cache[require.resolve(path.join(require.main.path, _filePath, file))]
        
        return command
    }

    registerEvent(file, _filePath, _this){
        const filePath = path.join(require.main.path, _filePath, file)

        var event = require(filePath)

        try {
            _this.client.on(file.split('.')[0], event.bind(null, _this.client))
            _this.client.eventCount++
            _this.Log.custom('EVNT', '#00FF00', `-> Loaded event '${file.split('.')[0]}'`)
            
        } catch (error) {
            _this.Log.custom('ERROR', '#FF0000', `Event file '${file.split('.')[0]}' Had a error loading.\n${error}`)
        }

        delete require.cache[require.resolve(path.join(require.main.path, _this.eventPath, file))]  

        

        return event
    }
}

module.exports = Registry