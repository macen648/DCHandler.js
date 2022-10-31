module.exports = {
    name: 'nest3',
    aliases: [],
    execute(client, message, args) {
        message.react("🏓")
        return message.channel.send(`**${client.ws.ping}ms** 🛰️`)
    },
}