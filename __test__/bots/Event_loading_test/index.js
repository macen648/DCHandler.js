import { Client, GatewayIntentBits } from 'discord.js'
import HandlerClient from '../../../index.js'
import fs from 'fs'

const config = JSON.parse(fs.readFileSync('../../config.json'))

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    disableMentions: 'everyone',
})

const Handler = new HandlerClient(client, {
    commandPath: "commands", 
    eventPath: "events",
    PREFIX: "$" 
})



client.login(config.TOKEN)

