const { Client, GatewayIntentBits } = require('discord.js')
const { HandlerClient } = require('../../../index')

const { TOKEN } = require('../../config.json')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    disableMentions: 'everyone',
})

// const Handler = new HandlerClient(client, {
//     commandPath: "commands",
//     //commandPath: "commands_1",  
//     //commandPath: "commands_empty", 
//     PREFIX: "$" 
// })

const Handler = new HandlerClient(client)
//const Handler = new HandlerClient(client, 'config2')
//const Handler = new HandlerClient()

client.login(TOKEN)

