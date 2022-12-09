import dayjs from 'dayjs'
import chalk from 'chalk'

export class DCH_ERROR extends Error {
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
        this.timeStamp = dayjs().format('HH:mm:ss')
        this.code = code
        this.exitCode = exitCode
    }
}

export class DCH_CMD_ERROR {
    /**
     * Emits a **DCH_CMD_ERROR**.
     * 
     * Doesn't exit process.
     * 
     * @param {string} [message] Error Message
     */
    constructor(message) {
        return console.log(`${dayjs().format('HH:mm:ss')} ${chalk.hex('#FF0000')(`[CMD] `)} ${message}`)
    }
}

export class DCH_LOAD_ERROR {
    /**
     * Emits a **DCH_LOAD_ERROR**.
     * 
     * Doesn't exit process.
     * 
     * @param {string} [message] Error Message
     */
    constructor(message) {
        return console.log(`${dayjs().format('HH:mm:ss')} ${chalk.hex('#FF0000')(`[LOAD] `)} ${message}`)
    }
}

export class DCH_DB_ERROR {
    /**
     * Emits a **DCH_DB_ERROR**.
     * 
     * Doesn't exit process.
     * 
     * @param {string} [message] Error Message
     */
    constructor(message) {
        return console.log(`${dayjs().format('HH:mm:ss') } ${chalk.hex('#FF0000')(`[DB] `)} ${message}`)
    }
}
