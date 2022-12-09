export default {
    name: 'no_aliases', 
    execute(client, message, args) {
        return message.channel.send('Test')
    },
}