// ----- Variables -----

// -- Local Variables --
//const config = require("./config");
require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client({
	disableEveryone: true
});
//const Sentry = require("@sentry/node");

// -- Global Variables --
global.CONSTANTS = require("./src/utils/constants");
global.fetch = require("node-fetch");

// ----- Command and Event Handler -----

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.events = new Discord.Collection();

// -- Command Handler --
fs.readdir("./src/cmds/", (err, files) => {
	if (err) console.error(err);
	for (const name in files) {
		const cmd = files[name];
		if (!cmd.endsWith(".js")) return;
		let command = require(`./src/cmds/${cmd}`);
		client.commands.set(command.config.name, command);
		console.log(`[C] Successfully loaded ${cmd}`);
	}
});

// -- Events Handler --
fs.readdir("./src/events/", (err, files) => {
	if (err) console.error(err);
	for (const name in files) {
		const event = files[name];
		if (!event.endsWith(".js")) return;
		let eventFunc = require(`./src/events/${event}`);
		let eventName = event.split(".")[0];
		client.on(eventName, eventFunc.bind(null, client));
		console.log(`[E] Successfully loaded ${event}`);
	}
});

// ----- Start the bot! -----

client.login(process.env.TOKEN)
	.catch(console.error);
