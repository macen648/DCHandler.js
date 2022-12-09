export default {
    name: 'devCommand',
    aliases: [],
    execute(client, message, args) {
        return message.channel.send('test')
    },
}