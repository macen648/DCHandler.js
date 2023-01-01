# DCHandler.js
[![NPM Badge](https://nodei.co/npm/dchandler.png?downloads=true&stars=true)](https://nodei.co/npm/dchandler.js)

## About
DCHandler.js is the simple, powerful and straight to the point command handler for discord.js v14. 

## Features
* ES6
* Powerful and simple.
* Easy object based command structure.
* Per-Guild prefix(s) support using mongoDB.
* Debugging and logging. 

## Installation
Requires Node 12.0.0 or newer.

Installing with npm:
```$
npm i dchandler.js
```

# Example Usage
Basic setup

index.js
```js
import { Client, GatewayIntentBits } from 'discord.js'
import HandlerClient from 'dchandler.js'

const client = new Client({
    intents: [], // Your bots required Intents.
})

const handler = new HandlerClient(client, { // Pass in discord.js client and options.
                                                    // All options are fully optional.  
    commandPath: "commands", // Commands folder.
    eventPath: "events", // Commands folder.
    MongoURI: "mongodb://localhost:27017/test", // URI to connect to a mongoDB database
    PREFIX: "$" // Default bot prefix.
})

client.login('token')// Your bots token.
```
# Config
By default DCH will try and load config.json or.env. 

If it is unable to locate config.json or .env default values will be loaded instead.
      
If a config.json or .env is loaded, values will be overwritten by any values passed in as an Object.

With that if a config.json and .env are loaded, .env will overwrite config.json values.

Default values:
- PREFIX: '$'
- CommandPath: 'commands'

Pass in an object.
```js
const handler = new HandlerClient(client, { //options
    commandPath: "commands", // Commands folder.
    eventPath: "events", // Commands folder.
    MongoURI: "mongodb://localhost:27017/test", // URI to connect to a mongoDB database
    PREFIX: "$" // Default bot prefix.
})
```

Pass in path to json file.
```js
const handler = new HandlerClient(client, 'config')
```

Auto load a .env or config.json
```js
const handler = new HandlerClient(client)
```

## A .json file can be structured as such.

This will load all of the .json file's contents into Options.

Same applies to .env.
```json
{
    "commandPath": "commands",
    "eventPath": "events",
    "MongoURI": "mongodb://localhost:27017/test",
    "PREFIX": "$" 
}
```
or

This will only load the "Handler":{...} object into Options.
```json
{
    "Handler": {
        "commandPath": "commands",
        "eventPath": "events",
        "MongoURI": "mongodb://localhost:27017/test",
        "PREFIX": "$"
    }
}
```

# Per-Guild prefix(s)
If no MongoURI path is passed in, 
Dch will not use per Guild prefixing and will strictly use the default prefix. 

If a MongoURI is passed in and a connection to mongoDB is successful,
Dch will use the prefix assigned to that guild.
If there isn't an assigned prefix in the data base.
The default prefix is used instead. 

# Basic command
ping.js
```js
export default {
/**
    Information about the command.
    Name
    aliases
    ect...

    Anything put here can be accessed for custom features such as a help command.
*/
    name: 'ping', // Name and aliases are used by the command handler to call the command.
    aliases: [],
    execute(client, message, args) {// Any code put inside the execute call back will be executed when the command is ran.
        message.react("🏓")
        return message.channel.send(`**${client.ws.ping}ms** 🛰️`)
    },
}
```
Commands can be Exported as:
* export default {}
* export const command = {}
* export const Command = {}


# Basic Event
guildCreate.js
```js
// Unlike a Command the name of the file is what events get identified by.
export default (client, guild) => { // Options needed for this event, client is always required. Guild is the event callback.
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
Events can be Exported as:
* export default {}
* export const event = {}
* export const Event = {}

# Change prefix command
changePrefix.js
```js
import { db } from 'dchandler.js'

export default {
    name: 'changePrefix',
    aliases: ['cp'],
    execute(client, message, args) {
        if (!args[0]) return message.channel.send(`No given prefix!`)
        new db().setPrefix(args[0], message)
        return message.channel.send(`Changed prefix to ${args[0]} !`)
    },
}
```

# Options
- PREFIX [string]
- commandPath [string]
- eventPath [string]
- MongoURI [string]

# Start up Flags
- --debug
- --clear
- --ignore-warnings
- --v | --version
- --p-v | --project-versions

```$
node index.js --debug
```
Shows handler debug information such as loader status.

```$
node index.js --ignore-warnings
```
Hides 'Loaded with _ warnings!' messages.

```$
node index.js --clear
```
Hides all handler console messages.

```$
node index.js --v --p-v
```
- --v Shows Handler version.
- --p-v Shows All relevant project versions.

## AudioBoi
My music bot that is built with DCHandler.js.

## Example bot with this package
My repo: [Example-Discord-Bot](https://github.com/macen648/Example-Discord-Bot)

## Me
 - Discord: macen#0001
 - Github: https://github.com/macen648
 - Npm: https://www.npmjs.com/~macen

## License

MIT

**Free Software, Hell Yeah!**

## Made with love 
Macen <3
