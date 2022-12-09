// Made with love - Macen <3
// https://github.com/macen648/DCHandler

import fs from 'fs'
const Package = JSON.parse(fs.readFileSync('./package.json'))

import HandlerClient from './src/Client.js'

import MessageHandler from './src/MessageHandler.js'
import Registry from './src/Registry.js'
import Ready from './src/Ready.js'
import db from './src/db.js'

import { DCH_CMD_ERROR, DCH_DB_ERROR, DCH_LOAD_ERROR, DCH_ERROR } from './src/utils/ERROR.js'

import { clientDefaults } from './src/utils/DefaultValues.js'

import guild from './src/models/guild.js'

// Handler
export default HandlerClient

// Core

export { MessageHandler } 
export { Registry }
export { Ready } 
export { db }

// // Errors
export { DCH_CMD_ERROR }
export { DCH_DB_ERROR }
export { DCH_LOAD_ERROR } 
export { DCH_ERROR }

// Const
export { clientDefaults as DefaultValues  }

// Version
export const version = Package.version

// Models
export { guild }
