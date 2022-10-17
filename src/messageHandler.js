const { DCH_CMD_ERROR } = require('./utils/DCH_ERROR')
const Log = require('./utils/DCH_Log')

class MessageHandler{
    constructor(client, options = {}){

        this.client = client

        this.Log = new Log().addOptions({ hide: options.hideOutput })

        this.options = options

        this.PREFIX = this.options.PREFIX

    }

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