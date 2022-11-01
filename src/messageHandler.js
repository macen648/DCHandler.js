const { DCH_CMD_ERROR } = require('./utils/ERROR')
const Log = require('./utils/Log')
const db = require('./db')

class MessageHandler{
    /**
     * Parses incoming **Discord** Client messages and handles them accordingly.
     * 
     * Initializes a new **MessageHandler**.
     * 
     * @param {DiscordClient} DiscordClient Discord Client
     * @param {object} options Options
     */
    constructor(client, options = {}){

        this.client = client

        this.Log = new Log().addOptions({ hide: options.hideOutput })

        this.db = new db(options)
        
        this.options = options

        this.PREFIX = this.options.PREFIX

    }

    /**
     * Listens for the **messageCreate** Event and handles messages accordingly to dispatch commands.
     */
    listen(){
        this.client.on('messageCreate', async message => {
            var localPrefix = this.PREFIX

            if (message.author.bot) return
            if (message.channel.type === 'dm') return

            if(this.options.MongoDB){
                const result = await this.db.getPrefix(message)
                localPrefix = result ? result : this.PREFIX
            } 
                
            if (message.content.indexOf(localPrefix) !== 0) return

            const args = message.content.slice(localPrefix.length).trim().split(/ +/g)
            const command = args.shift().toLowerCase()

            const cmd = this.client.commands.get(command) || this.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command))

            if (cmd) cmd.execute(this.client, message, args).catch(error => {
                new DCH_CMD_ERROR(`Command '${command}' exited with Error`)
                this.Log.raw(error)
            })
        })
    }

}

module.exports = MessageHandler