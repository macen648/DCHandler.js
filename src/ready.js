const Log = require('./utils/DCH_Log')

class Ready{
    constructor(client, options){
     
        this.client = client

        this.options = options

        this.Log = new Log()

        client.on('ready', client => {
            this.Log.message(`🤖 ${client.user.tag} / Client id#${client.user.id} is online!`)
            this.Log.message(`Now listening for commands with default prefix: ${this.options.PREFIX}`)
        })   
    }
}

module.exports = Ready