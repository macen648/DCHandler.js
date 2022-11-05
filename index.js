// Made with love - Macen <3
// https://github.com/macen648/DCHandler
module.exports = {
	// Core
	HandlerClient: require('./src/Client'),
	MessageHandler: require('./src/MessageHandler'),
	Registry: require('./src/Registry'),
	Ready: require('./src/Ready'),
	db: require('./src/db'),

	// Utils
	formatMS: require('./src/utils/formatMS'),
	
	//Errors
	DCH_CMD_ERROR: require('./src/utils/ERROR').DCH_CMD_ERROR,
	DCH_DB_ERROR: require('./src/utils/ERROR').DCH_DB_ERROR,
	DCH_LOAD_ERROR: require('./src/utils/ERROR').DCH_LOAD_ERROR,
	DCH_ERROR: require('./src/utils/ERROR').DCH_ERROR,

	//formatted-logs
	FLogs: require('formatted-logs').FLogs,
	Paragraph: require('formatted-logs').Paragraph,
	colorNameToHex: require('formatted-logs').colorNameToHex,

	// Const
	DefaultValues: require('./src/utils/DefaultValues'),

	// Version
	version: require('./package.json').version,

	// Models
	guild: require('./src/models/guild'),
}
