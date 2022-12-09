export const command = {
    name: 'command', 
    aliases: [],
    execute(client, message, args) {
        return message.channel.send(`command`)
    },
}