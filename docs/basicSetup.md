# Basic setup

```js
const {Client, Intents} = require('discord.js')
const Handler = require('dchandler')

const client = new Client({
    intents: [], // Your bots required Intents.
})

const handler = new Handler.HandlerClient(client, {// Pass in discord.js client and options.
    commandPath: "commands", // commands folder.
    mongoPath: "", // MongoDBPath.
    PREFIX: "$" // Default bot prefix.
})

client.login('token')// Your bots token.
```