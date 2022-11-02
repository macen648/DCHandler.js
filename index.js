const { DCH_CMD_ERROR, DCH_DB_ERROR, DCH_LOAD_ERROR, DCH_ERROR } = require('./src/utils/ERROR')

module.exports = {
    //Core
    HandlerClient: require('./src/Client'),
    MessageHandler: require('./src/MessageHandler'),
    Registry: require('./src/Registry'),
    Ready: require('./src/Ready'),  
    db: require('./src/db'),

    //utils
    Log: require('./src/utils/Log'),
    parseMs: require('./src/utils/parseMs'),
    DCH_CMD_ERROR, 
    DCH_DB_ERROR,
    DCH_LOAD_ERROR, 
    DCH_ERROR,

    //Const
    DefaultValues: require('./src/utils/DefaultValues'),

    //version
    version: require('./package.json').version,

    //models
    guild: require('./src/models/guild'),

}

//Made with love - Macen <3