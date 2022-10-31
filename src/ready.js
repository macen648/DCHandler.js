const Log = require('./utils/Log')

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

        this.Log = new Log().addOptions({ hide: options.hideOutput })

        client.on('ready', client => {
            this.Log.message(`🤖 ${client.user.tag} / Client id#${client.user.id} is online!`)
            this.Log.message(`Now listening for ${client.commands.size} commands with default prefix: ${this.options.PREFIX}`)
        })   
    }
}

module.exports = Ready