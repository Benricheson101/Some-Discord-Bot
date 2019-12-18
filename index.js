// ----- Variables -----

// -- Local Variables --
require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client({
	disableEveryone: true,
	fetchAllMembers: true
});
const mongoose = require("mongoose");

// -- Global Variables --
global.CONSTANTS = require("./src/utils/constants");
global.fetch = require("node-fetch"); // Unsplash-js requires this to be global for some reason
global.logger = require("./src/utils/logger.js");

// ----- Command and Event Handler -----

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.events = new Discord.Collection();

// ----- Database -----

// -- Connect --
mongoose.connect("mongodb://localhost/settings", {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
	.catch((err) => {
		throw new Error(err);
	});

// -- Do Stuff --
let db = mongoose.connection;
db.on("error", (error) => {
	console.error.bind(console, "Connection error: ");
});
db.once("open", () => {
	console.info("[I] Connected to MongoDB!");
});

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

client.login(process.env.NODE_ENV === "production" ? process.env.TOKEN : process.env.DEV_TOKEN)
	.catch(console.error);

// ----- Handle stuff -----

process.once("beforeExit", (exitCode) => {
	console.log(exitCode);
	if (exitCode === "SIGINT") return;
	logger.exit.bind(exitCode, { exit: true });
});
process.once("exit", (exitCode) => {
	console.log("Exiting with code: " + exitCode);
});
/*process.once("SIGINT", (exitCode) => {

	logger.exit.bind("SIGINT", { exit: true })
});*/

/*process.on("unhandledRejection", (error) => {
	console.error("unhandledRejection", error);
});*/

// ----- Glitch Stuff -----

// -- Don't Sleep Please --
if (process.env.NODE_ENV === "production") {
	const app = (require("express"))();
	app.get("/", (request, response) => {
		response.sendStatus(200);
	});
	app.listen(process.env.PORT);
	setInterval(() => {
		(require("http")).get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
	}, 140000);
}
