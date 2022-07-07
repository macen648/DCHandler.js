const p = require('../package.json')
const Log = require('./log')

class Ready{
    constructor(client, options){
     
        this.client = client

        this.options = options

        this.Log = new Log(options)

        client.on('ready', client => {
            
            if (!this.options.noShowActivity) client.user.setActivity(this.options.customActivity.name, { type: `${this.options.customActivity.type}` })
            else client.user.setPresence({ activity: null })

            this.Log.message(`🤖 Client id#${client.user.id} : ${client.user.tag} is online 🟩 App📦@${client.user.username} is running on DCH@v${p.version}👍`)
            this.Log.message(`🤖 Client id#${client.user.id} : ${client.user.tag} now listening👂 For commands💬 with default prefix: ${this.options.PREFIX}`)
        })   
    }
}

module.exports = Ready