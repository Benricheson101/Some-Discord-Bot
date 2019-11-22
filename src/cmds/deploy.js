const { promisify } = require('util');
const { exec } = require('child_process');
const asyncExec = promisify(exec);

module.exports.config = {
	name: "deploy",
	aliases: [],
	ownerOnly: false,
	guildOnly: false
};



module.exports.run = async (client, message, args) => {
	let m = await message.channel.send("Deploy command received...")
	console.log("Deploy command received...")
		.then(() => {
			m.edit("Updating code...");
			console.log("Updating code from Git");
			return asyncExec("git fetch origin && git reset --hard origin/production");
		})
		.then((x) => {
			console.log("Updating NPM modules");
			m.edit("Updating NPM modules...");
			return asyncExec("npm i --production");
		})
		.then((x) => {
			return asyncExec("git rev-parse HEAD");
		})
		.then((x22) => {
			console.log("Shutting down...");
			m.edit("Shutting down...");
			return asyncExec("process.exit(0)")
		})
};

