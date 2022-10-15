const Log = require("./DCH_Log")
const path = require('path')

const _package = require('../../package.json')

class DCH_Info {
    constructor(_handlerClient){
        this.handlerClient = _handlerClient
        this.Log = new Log()

        const _path = path.join(require.main.path, './', 'package.json')
        this.ex_package = require(_path)

    }

    debug(){
        this.Log.custom('DEBUG', '#cccccc', '')
            .raw(`DCH v${_package.version}`)
            .raw(`Discord.js v${this.ex_package.dependencies["discord.js"]}`)
            .raw(`Node ${process.version}`)
            .raw(`${this.ex_package.name} v${this.ex_package.version}`)
            .custom('DEBUG', '#cccccc', '')
    }

    stats(){
        this.Log.custom('STATS', '#cccccc', '')
            .raw(`${this.ex_package.name} v${this.ex_package.version}`)
            .raw(`Default prefix: ${this.handlerClient.options.PREFIX}`)
            .raw(`Command count: ${this.handlerClient.DiscordClient.commands.size}\nEvent count: ${this.handlerClient.DiscordClient.eventCount}`)
            .raw(`Up time: ${this.handlerClient.DiscordClient.uptime}\nPing: ${this.handlerClient.DiscordClient.ws.ping} ms`)
            .custom('STATS', '#cccccc', '')
    }


    all(){
        this.Log.info("")
            .raw(`DCH v${_package.version}`)
            .raw(`Discord.js v${this.ex_package.dependencies["discord.js"]}`)
            .raw(`Node ${process.version}`)
            .white()
            .raw(`${this.ex_package.name} v${this.ex_package.version}`)
            .raw(`Default prefix: ${this.handlerClient.options.PREFIX}`)
            .raw(`Command count: ${this.handlerClient.DiscordClient.commands.size}\nEvent count: ${this.handlerClient.DiscordClient.eventCount}`)
            .raw(`Up time: ${this.handlerClient.DiscordClient.uptime}\nPing: ${this.handlerClient.DiscordClient.ws.ping} ms`)
            .white()
            .info("")
    }
}


module.exports = DCH_Info