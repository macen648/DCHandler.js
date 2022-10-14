const Log = require('./utils/DCH_Log')

class MessageHandler{
    constructor(client, options = {}){

        this.client = client

        this.Log = new Log(options)

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
                this.Log.custom('ERROR', '#FF0000', `Command '${command}' exited with Error`)
                this.Log.custom('ERROR', '#FF0000', error)
            })
        })
    }

}

module.exports = MessageHandler