# dchandler options

Options:
	commandPath: ‘string’  required
	PREFIX: ‘string’ optional default ‘$’
	mongoPath: ‘string’ optional default required
    eventPath: ‘string’ optional 
	showLogs: ‘bool’ optional default true
	customActivty: ‘object’ optional default {default message}
	noShowActivity: ‘bool’ optional default false	
	
```js
const handler = new Handler.HandlerClient(client, {// Pass in discord.js client and options.
    commandPath: "commands", // commands folder.
    PREFIX: "$" // Default bot prefix.
    mongoPath: "", // MongoDB Path.
    eventPath: "", // Events folder
    showLogs: true, // If you dont want bot logs make false.
    customActivity: {name: 'This is a activity message', type: 'WATCHING'}, // If you wish to change the default activity. 
    noShowActivity: false // If youd rather not show activity make true.
})
```