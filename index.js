// ----- Variables -----

// -- Local Variables --
require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client({
	disableEveryone: true
});

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

client.login(process.env.NODE_ENV === "development" ? process.env.DEV_TOKEN : process.env.TOKEN)
	.catch(console.error);

// ----- Glitch Stuff -----

// -- Don't Sleep Please --
const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
	console.log(Date.now() + " Ping Received");
	response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
	http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);
