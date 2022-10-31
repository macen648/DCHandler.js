const { db } = require('../../../index')

module.exports = {
    name: 'changePrefix',
    aliases: ['cp'],
    execute(client, message, args) {
        if (!args[0]) return message.channel.send(`No given prefix!`)
        new db().setPrefix(args[0], message)
        return message.channel.send(`Changed prefix to ${args[0]} !`)
    },
}