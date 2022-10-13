const {Client, GatewayIntentBits} = require('discord.js')
const Handler = require('../index')

const {TOKEN} = require('./config.json')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    disableMentions: 'everyone',
})

const handler = new Handler.HandlerClient(client, {
    commandPath: "commands", 
    PREFIX: "$" 
})

client.login(TOKEN)
