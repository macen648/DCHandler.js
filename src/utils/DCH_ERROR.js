const moment = require('moment')
const chalk = require('chalk')

class DCH_ERROR extends Error {
    constructor(message, exitCode, code) {
        super(message)

        Error.captureStackTrace(this, this.constructor)
        this.name = this.constructor.name
        this.timeStamp = moment().format('HH:MM:SS')
        this.code = code
        this.exitCode = exitCode
    }
}

class DCH_CMD_ERROR {
    constructor(message) {
        return console.log(`${moment().format('HH:MM:SS')} ${chalk.hex('#FF0000')(`[CMD]`)} ${message}`)
    }
}

class DCH_LOAD_ERROR {
    constructor(message) {
        return console.log(`${moment().format('HH:MM:SS')} ${chalk.hex('#FF0000')(`[LOAD]`)} ${message}`)
    }
}

module.exports = {
    DCH_ERROR,
    DCH_CMD_ERROR,
    DCH_LOAD_ERROR 
}  
