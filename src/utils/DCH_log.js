const moment = require('moment')
const chalk = require('chalk')

class DCH_Log {
    constructor(options, message){
        if(options.showLogs === undefined || options.showLogs === null || options.showLogs === "") options.showLogs = true

        this.showLogs = options.showLogs
        this.timeStamp = options.timeStamps
        this.options = options

        if(message){
            this.custom('', '#cccccc', message)
            return this  
        }
    }

    message(message){
        this.custom('', '#cccccc', message)
        return this   
    }

    info(message){
        this.custom('INFO', '#cccccc', message)
        return this
    }

    warn(message) {
        this.custom('WARN', '#fff100', message)
        return this
    }

    error(type, message) {
        throw new Error(`[${type}] ${message}`)
    }

    custom(type, color, message) {
        if (this.showLogs === false) return

        const lines = message.trimEnd().split('\n')
        if (type === '' || null || undefined) for (const line of lines) console.log(`${moment().format('HH:MM:SS')} ${line}`)
        else for (const line of lines) console.log(`${moment().format('HH:MM:SS')} ${chalk.hex(color)(`[${type}]`)}  ${line}`)
        return this
    }

    raw(message) {
        const lines = message.split('\n')
        for (const line of lines) console.log(line)
        return this
    }

    white(){
        console.log("")
        return this
    }


}

module.exports = DCH_Log