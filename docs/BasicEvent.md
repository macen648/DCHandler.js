# Basic Event

File name guildCreate.js
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