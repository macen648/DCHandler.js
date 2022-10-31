const { Client, GatewayIntentBits } = require('discord.js')
const { HandlerClient } = require('../../index')

const { TOKEN, MONGOURI } = require('../config.json')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    disableMentions: 'everyone',
})

//const Handler = new HandlerClient(client, { PREFIX: ".", eventPath: 'events' })

const Handler = new HandlerClient(client, { PREFIX: ".", eventPath: 'events', MongoURI: MONGOURI })


//Handler.info()

client.login(TOKEN)
