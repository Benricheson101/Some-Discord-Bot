const setup = require("./logger-setup.js");
const { WebhookClient } = require("discord.js");

module.exports = {
	cmd: async (message) => {
		if (!setup.cmd.enabled) return;
		let hook = new WebhookClient(setup.cmd.id, setup.cmd.token);
		await hook.send(`${setup.emojis.tools} Command \`${message.content.split(" ")[0]}\` run by **${message.author.tag}** (\`${message.author.id}\`) in **#${message.channel.name}** (\`${message.channel.id}\`) in **${message.guild.name}** (\`${message.guild.id}\`)\n> \`${message.content}\``);
	},
	permErr: async (message) => {
		if (!setup.cmd.enabled) return;
		let hook = new WebhookClient(setup.cmd.id, setup.cmd.token);
		await hook.send(`${setup.emojis.x} **${message.author.tag}** (${message.author.id}) tried to run command \`${message.content.split(" ")[0]}\` in **#${message.channel.name}** (\`${message.channel.id}\`) in **${message.guild.name}** (\`${message.guild.id}\`) without the correct permissions.\n> \`${message.content}\``);
	},
	cmdErr: async (message, error) => {
		if (!setup.cmd.enabled) return;
		let hook = new WebhookClient(setup.cmd.id, setup.cmd.token);
		error = (error.stack).length >= 1600 ? (error.stack).substring(0, 2000) + " content too long..." : error.stack;
		await hook.send(`${setup.emojis.x} **${message.author.tag}** (\`${message.author.id}\`) tried to run command \`${message.content.split(" ")[0]}\` in **#${message.channel.name}** (\`${message.channel.id}\`) in **${message.guild.name}** (\`${message.guild.id}\`) but an unhandled error occurred.\n>>> \`\`\`js\n${error}\`\`\`\n\`${message.content}\``);
	},
	join: async (client, guild) => { // NOTE: This is emitted when a server is affected by an outage
		if (!setup.join.enabled) return;
		let hook = new WebhookClient(setup.join.id, setup.join.token);
		await hook.send(`${setup.emojis.plus} Joined **${guild.name}** (\`${guild.id}\`)\n> **Server Owner**: ${guild.owner.user.tag} (\`${guild.owner.user.id}\`)\n> **Total Guilds**: ${client.guilds.size}`);
	},
	leave: async (client, guild) => { // NOTE: This is emitted when a server is affected by an outage
		if (!setup.leave.enabled) return;
		let hook = new WebhookClient(setup.join.id, setup.join.token);
		await hook.send(`${setup.emojis.minus} Left **${guild.name}** (\`${guild.id}\`)\n> **Server Owner**: ${guild.owner.user.tag} (\`${guild.owner.user.id}\`)\n> **Total Guilds**: ${client.guilds.size}`);
	},
	ready: async (client) => {
		if (!setup.ready.enabled) return;
		let hook = new WebhookClient(setup.ready.id, setup.ready.token);
		await hook.send(`${setup.emojis.power} **${client.user.tag}** (\`${client.user.id}\`) is now online\n> **Total Guilds**: ${client.guilds.size}\n> **Total Users**: ${client.users.size}\n> **Total Channels**: ${client.channels.size}`);
	},
	exit: (options, exitCode) => {
		if (setup.exit.enabled === false) {
			if (options.exit === true) process.exit(exitCode || 0);
			return;
		}
		let hook = new WebhookClient(setup.exit.id, setup.exit.token);
		hook.send(`${setup.emojis.power} Shutting down...\n> **Exit Code**: ${exitCode || 0}\n> **Exit**: ${options.exit}`)
			.then(() => {
				if (options.exit === true) process.exit(exitCode || 0);
			});
	}
};
