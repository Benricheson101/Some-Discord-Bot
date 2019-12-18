const { settings } = require("../utils/db/schemas");
module.exports = async (client, message) => {
	settings.findOne({ guildId: message.guild.id }, async (err, guild) => {
		if (err) throw new Error(err);

		if (!guild) {
			guild = new settings({
				guildId: message.guild.id
			}).save();
		}

		if (message.author.bot) return;
		let prefix = guild.prefix || CONSTANTS.config.prefix;
		if (message.content.indexOf(prefix) !== 0) return;

		const args = message.content.slice(prefix.length).split(/ +/g);
		const command = args.shift().toLowerCase();

		const cmd = client.commands.get(command) || client.commands.find((c) => c.config.aliases && c.config.aliases.includes(command));
		if (!cmd) return;

		// if the user does not have the permission											in a text channel						and they aren't a superuser

		if (!message.member.permissions.has(cmd.config.permissions) && message.channel.type === "text" && !CONSTANTS.superUsers.includes(message.author.id)) {
			return message.reply(CONSTANTS.errors.noperms);
		}

		if (cmd.config.guildOnly && message.channel.type !== "text") {
			return message.reply(CONSTANTS.errors.guildOnly);
		}

		if (cmd.config.ownerOnly === true) {
			if (!(CONSTANTS.superUsers.includes(message.author.id))) {
				await logger.permErr(message);
				return message.channel.send(CONSTANTS.errors.noperms);
			}
		}

		try {
			cmd.run(client, message, args)
				.then(async () => {
					await logger.cmd(message);
				})
				.catch(async (err) => {
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
			console.error(err);
			logger.cmdErr(message, err);

			let embed = new (require("discord.js")).MessageEmbed()
				.setAuthor("something happened")
				.setTitle(err.message)
				.setDescription(`\`\`\`js\n${(err.stack).length >= 2048 ? (err.stack).substring(0, 2000) + " content too long..." : err.stack}\`\`\``)
				.setColor("DARK_RED")
				.setTimestamp()
				.setFooter(message.content);

			client.channels.find((c) => c.id === CONSTANTS.config.logs).send({ embed: embed });
			return message.channel.send(CONSTANTS.errors.generic);
			if (CONSTANTS.superUsers.includes(message.author.id)) {
				message.channel.send({ embed: embed });
			}
		}
	});
};
