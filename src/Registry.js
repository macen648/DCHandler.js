const prettyMilliseconds = require("pretty-ms")
const Discord = require('discord.js')
const path = require("path")
const fs = require("fs")

const Log = require('./utils/DCH_Log')
const { DCH_CMD_ERROR } = require('./utils/DCH_ERROR')
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

        if(result === "empty") return this.Log.warn(`Commands folder is empty.\nNo commands loaded.`)
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

        function subDir(path, _this){
            const dirs = fs.readdirSync(path, { withFileTypes: true }).filter(item => item.isDirectory()).map(item => item.name)
            if (!dirs) return 

            for (const dir of dirs) {
                if (fs.readdirSync(`${path}/${dir}`) == '') return _this.Log.warn(`Folder ${dir} is empty.`)
                subDir(`${path}/${dir}`, _this)
                fs.readdirSync(`${path}/${dir}`).filter(file => file.endsWith(".js")).forEach(file => {
                     registerFile(file, `${path}/${dir}`, _this)
                })
            }
            
        }

        if (fs.readdirSync(path) == '') return "empty"

        
    
        fs.readdirSync(`${path}`).filter(file => file.endsWith(".js")).forEach(file => {
            registerFile(file, `${path}`, this)

        })
        
        subDir(path, this)
        
        return "success"
    }

    registerCommand(file, _filePath, _this) {

        const filePath = path.join(require.main.path, _filePath, file)

        var command = require(filePath)

        try {
            if (Object.keys(command).length === 0) return _this.Log.warn(`Command file '${file}' isn't correct (Missing Command Structure).\nSkipping.`)
            if (!command.name) Object.assign(command, { name: file.split('.')[0] })

            if (_this.client.commands.some(cmds => cmds.name === command.name)){
                _this.Log.warn(`-> Command with the name ${command.name.toLowerCase()} already exists, Loaded anyways.`)  
                return _this.client.commands.set(command.name.toLowerCase(), command)
            } 
            
            _this.client.commands.set(command.name.toLowerCase(), command)
            _this.Log.custom('CMD', '#00FF00', ` -> Loaded command '${command.name.toLowerCase()}'`)

        } catch (error) {
            new DCH_CMD_ERROR(`Command file '${file.split('.')[0]}' Had a error loading.\n${error}`)
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
            new DCH_CMD_ERROR(`Event file '${file.split('.')[0]}' Had a error loading.\n${error}`)
        }

        delete require.cache[require.resolve(path.join(require.main.path, _this.eventPath, file))]  

        

        return event
    }
}

module.exports = Registry