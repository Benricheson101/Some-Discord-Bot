const setup = require("./logger-setup.js");
const { WebhookClient } = require("discord.js");

function clean (text) {
	text = text.replace(/`/g, "\\\`");
	return text;
}

module.exports = {
	cmd: async (client, message) => {
		let hook = new WebhookClient(setup.cmd.id, setup.cmd.token);
		await hook.send(`<:Tools:654929950691819520> Command \`${clean(message.content.split(" ")[0])}\` run by **${message.author.tag}** (\`${message.author.id}\`) in **#${message.channel.name}** (\`${message.channel.id}\`) in **${message.guild.name}** (\`${message.guild.id}\`)\n> \`${message.content}\``);
	},
	permErr: async (client, message) => {
		let hook = new WebhookClient(setup.cmd.id, setup.cmd.token);
		await hook.send(`<:X_:654938357746499594> **${message.author.tag}** (${message.author.id}) tried to run command \`${clean(message.content.split(" ")[0])}\` in **#${message.channel.name}** (\`${message.channel.id}\`) in **${message.guild.name}** (\`${message.guild.id}\`) without the correct permissions.\n> \`${message.content}\``);
	},
	cmdErr: async (client, message) => {
		let hook = new WebhookClient(setup.cmd.id, setup.cmd.token);
		await hook.send(`<:X_:654938357746499594> **${message.author.tag}** (${message.author.id}) tried to run command \`${clean(message.content.split(" ")[0])}\` in **#${message.channel.name}** (\`${message.channel.id}\`) in **${message.guild.name}** (\`${message.guild.id}\`) but an unhandled error occurred.\n> \`${message.content}\``);
	},
	join: async (client, guild) => {
		let hook = new WebhookClient(setup.join.id, setup.join.token);
		await hook.send(`<:Plus:654938356785872906> Joined **${guild.name}** (\`${guild.id}\`)\n> **Server Owner**: ${guild.owner.user.tag} (\`${guild.owner.user.id}\`)\n> **Total Guilds**: ${client.guilds.size}`);
	},
	leave: async (client, guild) => {
		let hook = new WebhookClient(setup.join.id, setup.join.token);
		await hook.send(`<:Minus:654938355749879858> Left **${guild.name}** (\`${guild.id}\`)\n> **Server Owner**: ${guild.owner.user.tag} (\`${guild.owner.user.id}\`)\n> **Total Guilds**: ${client.guilds.size}`);
	},
	ready: async (client) => {
		let hook = new WebhookClient(setup.ready.id, setup.ready.token);
		await hook.send(`<:Check:654959034239287306> **${client.user.tag}** (\`${client.user.id}\`) is now online\n> **Total Guilds**: ${client.guilds.size}\n> **Total Users**: ${client.users.size}\n> **Total Channels**: ${client.channels.size}`)
	}
};
