const { Client, GatewayIntentBits } = require('discord.js')
const { HandlerClient } = require('../../index')

const { TOKEN } = require('../config.json')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    disableMentions: 'everyone',
})

const Handler = new HandlerClient(client)



client.login(TOKEN)

