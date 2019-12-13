const setup = require("./logger-setup.js");
const { WebhookClient } = require("discord.js");

function clean (text) {
	text = text.replace(/`/g, "\\\`");
	console.log(text);
	return text;
}

module.exports = {

	cmd: (client, data) => {
		let hook = new WebhookClient(setup.cmdHook.id, setup.cmdHook.token);
		hook.send(`:tools: Command \`${clean(data.content)}\` run by **${data.author.tag}** (\`${data.author.id}\`) in **#${data.channel.name}** (\`${data.channel.id}\`) in **${data.guild.name}** (\`${data.guild.id}\`)`);
	},
	join: (client, data) => {
		let hook = new WebhookClient(setup.joinHook.id, setup.joinHook.token);
		hook.send(`:door: Joined **${data.name}** (${data.id}.\n> Total Guilds: ${client.guilds.size}`); //TODO: Add more stuff to this
	}
};

/*module.exports = {
	cmdHook
};*/
