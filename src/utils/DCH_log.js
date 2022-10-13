const moment = require('moment')
const chalk = require('chalk')

class DCH_Log {
    constructor(options, message){
        if(options.showLogs === undefined || options.showLogs === null || options.showLogs === "") options.showLogs = true
        if(options.timeStamps === undefined || options.timeStamps === null || options.timeStamps === "") options.timeStamps = true

        this.showLogs = options.showLogs
        this.timeStamp = options.timeStamps
        this.options = options

        if(message){
            if (this.showLogs === false) return

            const lines = message.trim().split('\n')
            for (const line of lines) console.log(`${moment().format('HH:MM:SS')}    :    ${line}`)
            return this
        }
    }

    info(message){
        if(this.showLogs === false) return

        const lines = message.trim().split('\n')
        for (const line of lines) console.log(`${moment().format('HH:MM:SS')} [INFO]  ${line}`)
        return this
    }

    warn(message) {
        if(this.showLogs === false) return

        const lines = message.trim().split('\n')
        for (const line of lines) console.log(`${moment().format('HH:MM:SS')} ${chalk.hex('#fff100')('[WARN]')}  ${line}`) 
        return this
    }

    type(type, color, message) {
        if (this.showLogs === false) return

        const lines = message.trimEnd().split('\n')
        for (const line of lines) console.log(`${moment().format('HH:MM:SS')} ${chalk.hex(color)(`[${type}]`)}  ${line}`)
        return this
    }

    raw(message) {
        const lines = message.split('\n')
        for (const line of lines) console.log(line)
        return this
    }

    error(type, message){
       throw new Error(`[${type}] ${message}`)
    }
}

module.exports = DCH_Log