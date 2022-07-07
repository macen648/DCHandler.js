# Basic change prefix command

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
    // helper funtion to cut down on code
        async function Mongo(mongoPath) {
            await mongoose.connect(mongoPath, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            return mongoose
        }
    //--

    //**
    // This is the structure of the document used to store the server prefix within mongoDB
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