module.exports = {
    name: 'devCommand',
    aliases: [],
    execute(client, message, args) {
        return message.channel.send('test')
    },
}