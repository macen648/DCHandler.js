const { DCH_CMD_ERROR, DCH_LOAD_ERROR, DCH_ERROR } = require('./src/utils/ERROR')

module.exports = {
    //Core
    HandlerClient: require('./src/Client'),
    MessageHandler: require('./src/MessageHandler'),
    Registry: require('./src/Registry'),
    Ready: require('./src/Ready'),  
    db: require('./src/db'),

    //utils
    Log: require('./src/utils/Log'),
    Info: require('./src/utils/Info'),
    DCH_CMD_ERROR, 
    DCH_LOAD_ERROR, 
    DCH_ERROR,

    //Const
    DEFAULTS: require('./src/utils/Defaults'),

    //version
    version: require('./package.json').version,

    //models
    guild: require('./src/models/guild'),

}

//Made with love - Macen <3