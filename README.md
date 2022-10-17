# DCHandler
[![NPM Badge](https://nodei.co/npm/dchandler.png?downloads=true&stars=true)](https://nodei.co/npm/dchandler)

## About
DCHandler is the simple and straight to the point command handler to both help get your discord bot running, as well as allowing full control over everything. Skip the cluttered mess of other handlers and get straight to the point. DCHandler is mostly object-oriented and allows the use of [Discord.js](https://discord.js.org/#/) v13, and provides an easy to use and convenient command structure. 

## Features
* Light weight and simple.
* Easy and convenient command structure.

## Installation
Requires Node 12.0.0 or newer.

Installing with npm:
```$
npm i dchandler
```

# Example Usage
Basic setup

index.js
```js
const {Client, GatewayIntentBits} = require('discord.js')
const Handler = require('dchandler')

const client = new Client({
    intents: [], // Your bots required Intents.
})

const handler = new Handler.HandlerClient(client, {// Pass in discord.js client and options.
    commandPath: "commands", // Commands folder.
    eventPath: "events", // Commands folder.
    PREFIX: "$" // Default bot prefix.
})

client.login('token')// Your bots token.
```

# Basic command
ping.js
```js
module.exports = {
/**
    Information about the command.
    Name
    aliases
    ect...

    Anything put here can be accessed for custom fetures such as a help command.
*/
    name: 'ping', // Name and aliases are used by the command handler to call the command.
    aliases: [],
    execute(client, message, args) {// Any code put inside the execute call back will be executed when the command is ran.
        message.react("🏓")
        return message.channel.send(`**${client.ws.ping}ms** 🛰️`)
    },
}
```

# Basic Event
guildCreate.js
```js
// Unlike a Commmand the name of the file is what events get identified by.
module.exports = (client, guild) => { // Options needed for this event, client is always required. Guild is the event callback.
    guild.systemChannel.send(`Hello!`).then(sentMessage => {
        sentMessage.react('👋')
        console.log(`Joined the guild: ${guild.name}!`)
    })
}

// This is replicating

/** 
client.on('guildCreate', guild => {
    guild.systemChannel.send(`Hello!`).then(sentMessage => {
        sentMessage.react('👋')
        console.log(`Joined the guild: ${guild.name}!`)
    })
}) 
*/

```
# Start up Flags
--debug
--clear
--ignore-warnings

```$
node index.js --debug
```
Shows handler debug infomation such as loader status.


```$
node index.js --ignore-warnings
```
Hides 'Loaded with _ warnings!' messages.


```$
node index.js --clear
```
Hides all handler console messages.

## Extra Resources
- Discord documentation:
     - https://discord.js.org/#/

- Worn off keys: 
     - https://www.youtube.com/channel/UChPrh75CmPP9Ig6jISPnfNA
     - https://www.youtube.com/watch?v=JMmUW4d3Noc&list=PLaxxQQak6D_f4Z5DtQo0b1McgjLVHmE8Q&ab_channel=WornOffKeys (How to Discord.js playlist)

- w3schools:
    - https://www.w3schools.com/js/ (js)

- My discord bot template:
    - https://github.com/macen648/discordBotTemplate

## Me
 - Discord: macen#0001
 - Github: https://github.com/macen648
 - Npm: https://www.npmjs.com/~macen

## License

MIT

**Free Software, Hell Yeah!**

## Made with love 
Macen <3