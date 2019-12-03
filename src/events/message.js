module.exports = async (client, message) => {
	if (message.author.bot) return;
	let prefix = process.env.NODE_ENV === "production" ? CONSTANTS.config.prefix : CONSTANTS.config.devPrefix;
	if (message.content.indexOf(prefix) !== 0) return;

	const args = message.content.slice(prefix.length).split(/ +/g);
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
	}

	/**
	 * Handles any errors that occur while running a command.
	 * @param {Error} err - The error
	 */
	function createError (err) {
		let embed = new (require("discord.js")).RichEmbed()
			.setAuthor("something happened")
			.setTitle(err.message)
			.setDescription(`\`\`\`js\n${(err.stack).length >= 2048 ? (err.stack).substring(0, 2000) + " content too long..." : err.stack}\`\`\``)
			.setColor("DARK_RED")
			.setTimestamp()
			.setFooter(message.content);

		console.error(err);
		client.channels.find((c) => c.id === (process.env.NODE_ENV === "development" ? CONSTANTS.config.devLogs : CONSTANTS.config.logs)).send(embed);
		message.channel.send(CONSTANTS.errors.generic);
		if (CONSTANTS.supers.includes(message.author.id)) {
			message.channel.send(embed);
		}
	}
};
