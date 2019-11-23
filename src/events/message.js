module.exports = async (client, message) => {
	if (message.author.bot) return;
	if (message.content === "!awoo") return message.channel.send(":eyes:"); // easter egg
	if (message.content.indexOf(CONSTANTS.config.prefix) !== 0) return;
	//if (message.guild.id === "636384678185795645") return;

	const args = message.content.slice(CONSTANTS.config.prefix.length).split(/ +/g);
	const command = args.shift().toLowerCase();

	const cmd = client.commands.get(command) || client.commands.find((c) => c.config.aliases && c.config.aliases.includes(command));
	if (!cmd) return;

	if (client.commands.find((c) => c.config.guildOnly) && message.channel.type !== "text") {
		return message.reply(CONSTANTS.errors.guildOnly);
	}

	if (cmd.config.ownerOnly === true) {
		if (!(CONSTANTS.supers.includes(message.author.id))) {
			return message.channel.send(CONSTANTS.errors.noperms);
		}
	}

	try {
		cmd.run(client, message, args)
			.catch((err) => {
				createError(err);
			});
	} catch (err) {
		createError(err);
		message.channel.send(CONSTANTS.errors.generic);
	}

	function createError (err) {
		console.error(err);
		// client.channels.find((c) => c.id === CONSTANTS.config.logChannel).send(message.content,
		message.channel.send(message.content,
			new (require("discord.js")).RichEmbed()
				.setAuthor("something happened")
				.setTitle(err.message)
				.setDescription(`\`\`\`js\n${(err.stack).length >= 2048 ? (err.stack).substring(0, 2000) + " content too long..." : err.stack}\`\`\``)
				.setColor("DARK_RED")
				.setTimestamp()
		);
	}
};
