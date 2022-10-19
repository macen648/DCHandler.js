const { DCH_CMD_ERROR, DCH_LOAD_ERROR, DCH_ERROR } = require('./src/utils/DCH_ERROR')

module.exports = {
    HandlerClient: require('./src/Client'),
    MessageHandler: require('./src/MessageHandler'),
    Registry: require('./src/Registry'),
    Ready: require('./src/Ready'),  

    DCH_Log: require('./src/utils/DCH_Log'),
    DCH_Info: require('./src/utils/DCH_Info'),
    DCH_CMD_ERROR, 
    DCH_LOAD_ERROR, 
    DCH_ERROR
}

//Made with love - Macen <3