const { promisify } = require("util");
const { exec } = require("child_process");
const asyncExec = promisify(exec);

module.exports.config = {
	name: "deploy",
	aliases: [],
	ownerOnly: true,
	guildOnly: false
};

module.exports.run = async (client, message, args) => {
	if (process.env.NODE_ENV !== "production" && args[0] !== "-f") return message.channel.send(":x: I am not running in the production environment. You probably don't want to deploy now.");
	let m = await message.channel.send("Deploy command received...");
	console.log("Deploy command received...");
	await client.channels.get(CONSTANTS.config.logChannel).send("Update queued...")
		.then(async () => {
			log("Updating code from Git");
			await m.edit("Updating code...");
			return asyncExec("git fetch origin && git reset --hard origin/production");
		})
		.then(async () => {
			log("Updating NPM modules");
			await m.edit("Updating NPM modules...");
			return asyncExec("npm i --production");
		})
		.then(async () => {
			log("Shutting down...");
			await m.edit("Shutting down...");
			return process.exit(0);
		});

	/**
	 * Log messages
	 * @param {string} msg - The message to log
	 */
	function log (msg) {
		console.log(msg);
		client.channels.get(CONSTANTS.config.logChannel).send(msg);
	}
};

