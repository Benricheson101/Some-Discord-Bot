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
	let m = await message.channel.send("Deploy command received...");
	console.log("Deploy command received...");
	await client.channels.get("646109408446775376").send("Update queued...")
		.then(async () => {
			console.log("Updating code from Git");
			await m.edit("Updating code...");
			return asyncExec("git fetch origin && git reset --hard origin/production");
		})
		.then(async () => {
			console.log("Updating NPM modules");
			await m.edit("Updating NPM modules...");
			return asyncExec("npm i --production");
		})
		.then(async () => {
			console.log("Shutting down...");
			await m.edit("Shutting down...");
			return process.exit(0);
		});
};

