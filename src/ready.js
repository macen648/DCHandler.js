const Log = require('./utils/DCH_log')

class Ready{
    constructor(client, options){
     
        this.client = client

        this.options = options

        this.Log = new Log(options)

        client.on('ready', client => {
            
            if (!this.options.noShowActivity) client.user.setActivity(this.options.customActivity.name, { type: `${this.options.customActivity.type}` })
            else client.user.setPresence({ activity: null })

            this.Log.info(`🤖 ${client.user.tag} / Client id#${client.user.id} is online!`)
            this.Log.info(`Now listening for commands with default prefix: ${this.options.PREFIX}`)
        })   
    }
}

module.exports = Ready