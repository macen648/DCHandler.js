export default {
    name: 'default', 
    aliases: [],
    execute(client, message, args) {
        return message.channel.send(`default`)
    },
}