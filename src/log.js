const moment = require('moment')

class Log {
    constructor(options){
        if(options.showLogs === undefined || options.showLogs === null || options.showLogs === "") options.showLogs = true
        if(options.timeStamps === undefined || options.timeStamps === null || options.timeStamps === "") options.timeStamps = true

        this.showLogs = options.showLogs
        this.timeStamp = options.timeStamps
        this.options = options
    }

    message(message){
        if(this.showLogs === false) return 
        if (this.timeStamp === true) return console.log(`${moment().format('HH:MM:SS')}    :    ${message}`)
        else return console.log(message)
    }

    info(message){
        if(this.showLogs === false) return
        if(this.timeStamp === true) return console.log(`${moment().format('HH:MM:SS')} [INFO]  ${message}`)
        else return console.log(`[INFO] ${message}`)
    }

    warn(message) {
        if (this.showLogs === false) return
        if (this.timeStamp === true) return console.log(`${moment().format('HH:MM:SS')} [WARN]  ${message}`)
        else return console.log(`[WARN] ${message}`)
    }

    lightError(type, message) {
        if (this.timeStamp === true) return console.log(`${moment().format('HH:MM:SS')} [${type}] ${message}`)
        else return console.log(`[${type}] ${message}`)
    }

    error(type, message){
       throw new Error(`[${type}] ${message}`)
    }

    //TODO: Add a timer
}

module.exports = Log