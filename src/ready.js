const { FLogs } = require('formatted-logs')

class Ready{
    /**
     * Bot **Console.Log** ready message.
     * 
     * @param {DiscordClient} [client] - Discord Client
     * @param {object} options - Options
     */
    constructor(client, options = {}){
     
        this.client = client

        this.options = options

        this.FLogs = new FLogs().addOptions({ hide: options.hideOutput })

        client.on('ready', client => {
            this.FLogs.log(`🤖 ${client.user.tag} / Client id#${client.user.id} is online!`)
            this.FLogs.log(`Now listening for ${client.commands.size} commands with default prefix: ${this.options.PREFIX}`)
        })   
    }
}

module.exports = Ready