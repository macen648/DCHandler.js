const Discord = require('discord.js')
const path = require("path")
const fs = require("fs")
const Log = require('./log')

class CommandLoader{
    constructor(client, commandPath, options = {}){
        
        this.client = client

        this.client.commands = new Discord.Collection()

        this.Log = new Log(options)

        this.options = options

        this.commandPath = commandPath

        this.eventPath = options.eventPath

    }   

    checkDirIsEmpty(path){
        const empty = fs.readdirSync(`${path}`)
        if(empty === 0) return true
        else return false
    }

    registerCommand(dir, file) {
        var command 

        if (dir == file) command = require(path.join(require.main.path, `${this.commandPath}`, file))
        else command = require(path.join(require.main.path, `${this.commandPath}/${dir}`, file))
        
        try {
            if (!command.name) Object.assign(command, { name: file.split('.')[0] })

            this.client.commands.set(command.name.toLowerCase(), command)
            this.Log.message(`🟩 -> Loaded command ${command.name.toLowerCase()}`)

        } catch (error) {
            this.Log.lightError('ERROR', `🟥 Command file '${file.split('.')[0]}' Had a error loading.`)
            this.Log.lightError('ERROR', error)
        } 

        if (dir == file) delete require.cache[require.resolve(path.join(require.main.path, `${this.commandPath}`, file))]
        else delete require.cache[require.resolve(path.join(require.main.path, `${this.commandPath}/${dir}`, file))]

        return command
    }

    loadCommands(){
        this.Log.message(`🔄 Loading commands...`)

        var commandCount = 0
        var loadedCommands = 0
        var i = 0

        const localDir = fs.readdirSync(`${this.commandPath}`).filter(file => file.endsWith(".js"))
        const empty = this.checkDirIsEmpty(this.commandPath)

        commandCount = localDir.length

        fs.readdirSync(`${this.commandPath}`).forEach(dirs => {
        

            if(dirs == localDir[i]){
                this.registerCommand(dirs, localDir[i])
                loadedCommands++
                i++
                return
            }
        
            const commands = fs.readdirSync(`${this.commandPath}/${dirs}`).filter(file => file.endsWith(".js"))
            commandCount += commands.length
        
            if(commands.length === 0) return this.Log.warn(`Folder ${dirs} is empty.`)

            for (const file of commands) {
                this.registerCommand(dirs, file)
                loadedCommands++
            }
        })

        if (empty) this.Log.warn(`Command folder empty.`)

        if (empty) this.Log.message(`No commands loaded.`)
        else this.Log.message(`👌 ${commandCount}/${loadedCommands} Commands loaded.`)
         
    }

    //TODO: refactor this lol
    // loadEvents(){
    //     this.Log.message(`Loading events...`)

    //     const localDir = fs.readdirSync(`${this.eventPath}`).filter(file => file.endsWith(".js"))
    //     const empty = fs.readdirSync(`${this.eventPath}`)
    //     var eventCount = localDir.length
    //     var loadedEvents = 0

    //     var i = 0
    //     fs.readdirSync(`${this.eventPath}`).forEach(dirs => {
    //         if (dirs == localDir[i]) {

    //             const event = require(path.join(require.main.path, `${this.eventPath}`, localDir[i]))

    //             try {

    //                 this.client.on(localDir[i].split('.')[0], event.bind(null, this.client))

    //                 this.Log.message(`🟩 -> Loaded event ${localDir[i].split('.')[0]}`)
    //                 loadedEvents++

    //             } catch (error) {
    //                 this.Log.lightError('ERROR', `🟥 Command file '${localDir[i].split('.')[0]}' Had a error loading.`)
    //                 this.Log.lightError('ERROR', error)
    //             }

    //             delete require.cache[require.resolve(path.join(require.main.path, `${this.eventPath}`, localDir[i]))]

    //             i++
    //             return
    //         }

    //         const events = fs.readdirSync(`${this.eventPath}/${dirs}`).filter(file => file.endsWith(".js"))
    //         eventCount += events.length

    //         if (events.length === 0) return this.Log.warn(`Folder ${dirs} is empty.`)

    //         for (const file of events) {

    //             const event = require(path.join(require.main.path, `${this.eventPath}/${dirs}`, file))

    //             try {
    //                 this.client.on(file.split('.')[0], event.bind(null, this.client))
    //                 this.Log.message(`🟩-> Loaded event ${file.split('.')[0]}`)
    //                 loadedEvents++
    //             } catch (error) {
    //                 this.Log.lightError('ERROR', `🟥 Event file '${file.split('.')[0]}' Had a error loading.`)
    //                 this.Log.lightError('ERROR', error)

    //             }

    //             delete require.cache[require.resolve(path.join(require.main.path, `${this.eventPath}/${dirs}`, file))]
    //         }
    //     })

    //     if (empty.length === 0) this.Log.warn(`Event folder empty.`)

    //     if (empty.length === 0) this.Log.message(`No events loaded.`)
    //     else this.Log.message(`👌 ${eventCount}/${loadedEvents} Events loaded.`)
        
    // }
}

module.exports = CommandLoader