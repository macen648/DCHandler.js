const { DCH_CMD_ERROR } = require('./utils/ERROR')
const Log = require('./utils/Log')

class MessageHandler{
    /**
     * Parses incoming **Discord** Client messages and handles them accrodingly.
     * 
     * Initializes a new **MessageHandler**.
     * 
     * @param {DiscordClient} DiscordClient Discord Client
     * @param {object} options Options
     */
    constructor(client, options = {}){

        this.client = client

        this.Log = new Log().addOptions({ hide: options.hideOutput })

        this.options = options

        this.PREFIX = this.options.PREFIX

    }

    /**
     * Listens for the **messageCreate** Event and handles messages accordingly to dispach commands.
     */
    listen(){
        this.client.on('messageCreate', async message => {
            if (message.author.bot) return
            if (message.channel.type === 'dm') return

            if (message.content.indexOf(this.PREFIX) !== 0) return

            const args = message.content.slice(this.PREFIX.length).trim().split(/ +/g)
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