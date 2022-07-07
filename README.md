# DCHandler
[![NPM Badge](https://nodei.co/npm/dchandler.png?downloads=true&stars=true)](https://nodei.co/npm/dchandler)

## About
DCHandler is the simple and straight to the point command handler to both help get your discord bot running, as well as allowing full control over everything. Skip the cluttered mess of other handlers and get straight to the point. DCHandler is mostly object-oriented and allows the use of [Discord.js](https://discord.js.org/#/) v13, and provides an easy to use and convenient command structure. For further information head over to the [Documentation](https://definitelymaceman.gitbook.io/dchandler/).

## Features
* Light weight and simple.
* Per server prefix handling with [mongoDB](https://www.mongodb.com/docs/).
* Easy and convenient command structure.

## Installation
Requires Node 12.0.0 or newer.
And for the use of per server prefixes, [Mongoose](https://mongoosejs.com/) is also a requirement.

Install the package with this command:
```$
npm i dchandler
```

To install Mongoose use:
```$
npm i mongoose
```

## Example Usage
Basic setup
```js
const {Client, Intents} = require('discord.js')
const Handler = require('dchandler')

const client = new Client({
    intents: [], // Your bots required Intents.
})

const handler = new Handler.HandlerClient(client, {// Pass in discord.js client and options.
    commandPath: "commands", // commands folder.
    mongoPath: "", // MongoDBPath.
    //useNoDB: true, // Specify 'useNoDB: true,' If you wish not to use DB and use only default prefix.
    PREFIX: "$" // Default bot prefix.
})

client.login('token')// Your bots token.
```
Basic command
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
Basic change prefix command

```js
const mongoose = require('mongoose') // https://mongoosejs.com/

module.exports = {
    /**
    Information about the command.
    Name
    aliases
    ect...

    Anything put here can be accessed for custom fetures such as a help command.
*/
    name: 'changePrefix',
    aliases: ['cp'],

    async execute(client, message, args) {

    //--
    // helper funtion to cut down on code.
        async function Mongo(mongoPath) {
            await mongoose.connect(mongoPath, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            return mongoose
        }
    //--

    //--
    // This is the structure of the document used to store the server prefix within mongoDB.
        const guildSchema = mongoose.Schema({ 
            _id: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            PREFIX: {
                type: String,
                required: true
            }
        })
        const _guildSchema = mongoose.model('guild', guildSchema)
    //--

        if (!args[0]) return message.channel.send(`Please enter a valid prefix ${message.author}`)// check to see if a argument is provied, if not deal with accordingly.
        
    //--
    // Search for and find the current guild and update the prefix to the first argument.
        await Mongo(client.handlerOptions.mongoPath).then(async mongoose => {
            try {
                await _guildSchema.findOneAndUpdate({
                    _id: message.guild.id
                }, {
                    _id: message.guild.id,
                    name: message.guild.name,
                    PREFIX: args[0],
                }, {
                    upsert: true
                })

            } finally {
                mongoose.connection.close()
            }
        })
    //--

        return message.channel.send(`Changed prefix to ${args[0]}`)// Return saying Prefix has been changed to the new Prefix.
    },
}
```

## Extra Resources
- dchandler documentation:
    - https://definitelymaceman.gitbook.io/dchandler/reference/classes

- My discord bot template:
    - https://github.com/macen648/discordBotTemplate

- Worn off keys: 
     - https://www.youtube.com/channel/UChPrh75CmPP9Ig6jISPnfNA
     - https://www.youtube.com/watch?v=JMmUW4d3Noc&list=PLaxxQQak6D_f4Z5DtQo0b1McgjLVHmE8Q&ab_channel=WornOffKeys (How to Discord.js playlist)

- The Net Ninja:
     - https://www.youtube.com/channel/UCW5YeuERMmlnqo4oq8vwUpg
     - https://www.youtube.com/watch?v=bxsemcrY4gQ&ab_channel=TheNetNinja (How to setup mongoDB)

- Discord documentation:
     - https://discord.js.org/#/

- w3schools:
    - https://www.w3schools.com/js/ (js)

## Todo:
- Make subFolders available within the command folder.
- Helper utils, such as better embed and bot info and uptime features.

## Me
 - Discord: macen#0001
 - Github: https://github.com/macen648
 - Npm: https://www.npmjs.com/~macen

## License

MIT

**Free Software, Hell Yeah!**

## Made with love 
Macen <3