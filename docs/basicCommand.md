# Basic command
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