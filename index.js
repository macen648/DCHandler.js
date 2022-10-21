const { DCH_CMD_ERROR, DCH_LOAD_ERROR, DCH_ERROR } = require('./src/utils/ERROR')

module.exports = {
    //Core
    HandlerClient: require('./src/Client'),
    MessageHandler: require('./src/MessageHandler'),
    Registry: require('./src/Registry'),
    Ready: require('./src/Ready'),  

    //utils
    Log: require('./src/utils/Log'),
    Info: require('./src/utils/Info'),
    DCH_CMD_ERROR, 
    DCH_LOAD_ERROR, 
    DCH_ERROR,

    //CONST
    DEFAULTS: require('./src/utils/Defaults')
}

//Made with love - Macen <3