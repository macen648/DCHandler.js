const Log = require("./DCH_Log")
const path = require('path')

const _package = require('../../package.json')

class DCH_Info {
    constructor(_handlerClient){
        this.handlerClient = _handlerClient
        this.Log = new Log(this.handlerClient.options)

        const _path = path.join(require.main.path, './', 'package.json')
        var ex_package = require(_path)

        this.Log.info("")
        .raw(`DCH v${_package.version}`)
        .raw(`Discord.js v${ex_package.dependencies["discord.js"]}`)
        .raw(`Node ${process.version}`)
        .white()
        .raw(`${ex_package.name} v${ex_package.version}`)
        .raw(`Default prefix: ${this.handlerClient.options.PREFIX}`)
        .raw(`Command count: ${this.handlerClient.DiscordClient.commands.size}\nEvent count: ${this.handlerClient.DiscordClient.eventCount}`)
        .raw(`Up time: ${this.handlerClient.DiscordClient.uptime}\nPing: ${this.handlerClient.DiscordClient.ws.ping} ms`)
        .white()
        .raw(`Made with love - Macen`)
        .info("")

    }
}


module.exports = DCH_Info