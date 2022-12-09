export default {
    name: 'upTime',
    aliases: [],
    execute(client, message) {
        return message.channel.send(`${client.uptime}`, `**Current up time**:`)
    },
}