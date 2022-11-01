// Custom Console logs ;)
const dayjs = require('dayjs')
const chalk = require('chalk')

class Log {
    /**
     * Custom Console logs ;)
     * 
     * @param {string} message Message
     *
     */
    constructor(message){
        this._options = {}

        if(message){
            if(!message) return
            this.message(message)  
        }
    }
    /**
     * Add option(s) to options.
     * 
     * @param {object | any} [__options] Option(s)
     * 
     * @returns Log
     */
    addOptions(__options){
        this._options = { ...this._options, ...__options }
        return this
    }
    /**
     * Custom **Log** message tag.
     * 
     * **HH:MM:SS [tag] (message)**
     * 
     * @param {string} [tag] - HH:MM:SS [tag] (message)
     * 
     * Leave blank to remove [tag]
     * @param {hex} [color] Colors [tag]
     * @param {string} [message] Message
     * @param {boolean} hide Hides from Logging
     * @returns Log
     */
    custom(tag, color, message, hide) {
        if (hide == false) return this
        if (this._options.hide == true) return this

        const lines = message.trimEnd().split('\n')
        if (tag === '' || null || undefined) for (const line of lines) console.log(`${dayjs().format('HH:mm:ss')} ${line}`)
        else for (const line of lines) console.log(`${dayjs().format('HH:mm:ss')} ${chalk.hex(color)(`[${tag}]`)}  ${line}`)
        
        return this
    }
    /**
     * Basic **Log** with format **HH:MM:SS (message)**
     * @param {string} [message] Message
     * @param {boolean} hide Hides from Logging
     * @returns Log
     */
    message(message, hide){
        this.custom('', '#cccccc', message, hide)
        return this   
    }

    /**
     * Info **Log** with format **HH:MM:SS [INFO] (message)**
     * @param {string} [message] Message
     * @param {boolean} hide Hides from Logging
     * @returns Log
     */
    info(message, hide){
        this.custom('INFO', '#cccccc', message, hide)
        return this
    }

    /**
     * Warning **Log** with format **HH:MM:SS [WARN] (message)**
     * @param {string} [message] Message
     * @param {boolean} hide Hides from Logging
     * @returns Log
     */
    warn(message, hide){
        this.custom('WARN', '#fff100', message, hide)
        return this
    }

    /**
     * Raw **string** that keeps the NewLine wrapping and hide functionality.
     * @param {string} [message] Message
     * @param {boolean} hide Hides from Logging
     * @returns Log
     */
    raw(message, hide){
        if (hide == false) return this
        if (this._options.hide == true) return this
        const lines = message.split('\n')
        for (const line of lines) console.log(line)
        return this
    }

    /**
     * Makes a white space.
     * 
     * @param {boolean} hide Hides from Logging
     * @returns Log
     */
    white(hide){
        if (hide == false) return this
        if (this._options.hide == true) return this
        console.log("")
        return this
    }
}

module.exports = Log