export const Command = {
    name: 'Command', 
    aliases: [],
    execute(client, message, args) {
        return message.channel.send(`Command`)
    },
}