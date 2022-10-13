const prettyMilliseconds = require("pretty-ms")
const Discord = require('discord.js')
const path = require("path")
const fs = require("fs")

const Log = require('./utils/DCH_log')

class CommandLoader{
    constructor(client, commandPath, options = {}){
        
        this.client = client

        this.client.commands = new Discord.Collection()

        this.Log = new Log(options)

        this.options = options

        this.commandPath = commandPath

        this.eventPath = options.eventPath

    }   

    loadCommands(){
        this.registerDirectory()
    }
    
    registerCommand(dir, file, single) {
        const filePath = path.join(require.main.path, `${this.commandPath}`, file)

        var command = {}

        if (single) command = require(filePath)
        else command = require(filePath)
        
        try {
            
            if (Object.keys(command).length === 0) return this.Log.warn(` Command file ${file} is empty.\nSkipping.`)
            if (!command.name) Object.assign(command, { name: file.split('.')[0] })

            if (this.client.commands.some(cmds => cmds.name === command.name)){
                this.Log.warn(`  -> Command with the name ${command.name.toLowerCase()} already exists, Loaded anyways.`)  
                return this.client.commands.set(command.name.toLowerCase(), command)
            } 
            
            this.client.commands.set(command.name.toLowerCase(), command)
            this.Log.type('CMD', '#00FF00', ` -> Loaded command '${command.name.toLowerCase()}'`)

        } catch (error) {
            this.Log.type('ERROR', '#FF0000', `Command file '${file.split('.')[0]}' Had a error loading.\n${error}`)
        } 

        if (single) delete require.cache[require.resolve(path.join(require.main.path, `${this.commandPath}`, file))]
        else delete require.cache[require.resolve(path.join(require.main.path, `${this.commandPath}/${dir}`, file))]

        return command
    }

    registerDirectory(){
        var startTime = performance.now()
        const dir = fs.readdirSync(`${this.commandPath}`).filter(file => file.endsWith(".js"))

        this.Log.info(`Loading commands...`)
        
        if (fs.readdirSync(this.commandPath) == '') return this.Log.warn(`Command folder is empty.\nNo commands loaded.`)

        var i = 0
        fs.readdirSync(`${this.commandPath}`).forEach(dirs => {

            if(dirs == dir[i]){
                this.registerCommand(dirs, dir[i], 1)
                return i++
            }
        
            const commands = fs.readdirSync(`${this.commandPath}/${dirs}`).filter(file => file.endsWith(".js"))
        
            if(commands.length === 0) return this.Log.warn(`Folder ${dirs} is empty.`)

            for (const file of commands) this.registerCommand(dirs, file)
            
        })

        this.Log.info(`Commands loaded in ${prettyMilliseconds(performance.now() - startTime)}`)
    }
}

module.exports = CommandLoader