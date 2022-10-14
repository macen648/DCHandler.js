module.exports = {
    name: 'nest',
    aliases: [],
    execute(client, message, args) {
        message.react("🏓")
        return message.channel.send(`**${client.ws.ping}ms** 🛰️`)
    },
}