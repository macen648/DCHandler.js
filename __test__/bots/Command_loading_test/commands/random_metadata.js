export default {
    name: 'ping',
    showHelp: true,
    macenWasHere: true,
    stats: ['good', 'bad', 'meh'],
    aliases: [],
    execute(client, message, args) {
        return message.channel.send('Test')
    },
}