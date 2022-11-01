const moment = require('moment')
const chalk = require('chalk')

class DCH_ERROR extends Error {
    /**
     * Throws a new **DCH_ERROR**
     * 
     * @param {string} [message] Error Message
     * @param {number} [exitCode] Exit Code
     * @param {string} [code] String Code
     */
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
    /**
     * Emits a **DCH_CMD_ERROR**.
     * 
     * Doesn't exit process.
     * 
     * @param {string} [message] Error Message
     */
    constructor(message) {
        return console.log(`${moment().format('HH:MM:SS')} ${chalk.hex('#FF0000')(`[CMD] `)} ${message}`)
    }
}

class DCH_LOAD_ERROR {
    /**
     * Emits a **DCH_LOAD_ERROR**.
     * 
     * Doesn't exit process.
     * 
     * @param {string} [message] Error Message
     */
    constructor(message) {
        return console.log(`${moment().format('HH:MM:SS')} ${chalk.hex('#FF0000')(`[LOAD] `)} ${message}`)
    }
}

class DCH_DB_ERROR {
    /**
     * Emits a **DCH_DB_ERROR**.
     * 
     * Doesn't exit process.
     * 
     * @param {string} [message] Error Message
     */
    constructor(message) {
        return console.log(`${moment().format('HH:MM:SS')} ${chalk.hex('#FF0000')(`[DB] `)} ${message}`)
    }
}


module.exports = {
    DCH_ERROR,
    DCH_CMD_ERROR,
    DCH_LOAD_ERROR,
    DCH_DB_ERROR 
}  
