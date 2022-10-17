// Custom Console logs ;)
const moment = require('moment')
const chalk = require('chalk')

class DCH_Log {
    constructor(message){
        this._options = {}

        if(message){
            this.message(message)
            return this  
        }
    }

    addOptions(__options){
        this._options = { ...this._options, ...__options }
        return this
    }

    custom(type, color, message, debug) {
        if (debug == false) return this
        if (this._options.hide == true) return this
        const lines = message.trimEnd().split('\n')
        if (type === '' || null || undefined) for (const line of lines) console.log(`${moment().format('HH:MM:SS')} ${line}`)
        else for (const line of lines) console.log(`${moment().format('HH:MM:SS')} ${chalk.hex(color)(`[${type}]`)}  ${line}`)
        return this
    }

    message(message, debug){
        this.custom('', '#cccccc', message, debug)
        return this   
    }

    info(message, debug){
        this.custom('INFO', '#cccccc', message, debug)
        return this
    }

    warn(message, debug){
        this.custom('WARN', '#fff100', message, debug)
        return this
    }

    raw(message, debug){
        if (debug == false) return this
        if (this._options.hide == true) return this
        const lines = message.split('\n')
        for (const line of lines) console.log(line)
        return this
    }

    white(debug){
        if (debug == false) return this
        if (this._options.hide == true) return this
        console.log("")
        return this
    }
}

module.exports = DCH_Log