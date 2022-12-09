import FLogs from 'formatted-logs'

export default class Ready{
    /**
     * Bot **Console.Log** ready message.
     * 
     * @param {DiscordClient} [client] - Discord Client
     * @param {object} options - Options
     */
    constructor(client, options = {}){
     
        this.client = client

        this.options = options

        client.on('ready', client => {
            FLogs.log(`🤖 ${client.user.tag} / Client id#${client.user.id} is online!`)
            FLogs.log(`Now listening for ${client.commands.size} commands with default prefix: ${this.options.PREFIX}`)
        })   
    }
}

