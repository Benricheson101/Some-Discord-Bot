const { RichEmbed } = require("discord.js");
module.exports.config = {
	name: "bot",
	aliases: [],
	ownerOnly: true,
	guildOnly: false
};

module.exports.run = async (client, message, args) => {
	switch (args[0]) {
	case ("destroy"): {
		message.channel.send("Refreshing...")
			.then(() => {
				client.destroy();
			})
			.then(() => {
				client.login(process.env.TOKEN)
					.catch((e) => {
						throw new Error(e);
					});
			})
			.then((m) => {
				return m.edit("Refresh complete.");
			});
		break;
	}
	case ("restart"): {
		message.channel.send("Shutting down...")
			.then(() => {
				client.destroy();
			})
			.then(() => {
				process.exit(0);
			});
		break;
	}
	case ("reload"): {
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);

		delete require.cache[require.resolve(`./${commandName}.js`)];

		try {
			const newCommand = require(`./${commandName}.js`);
			message.client.commands.set(newCommand.name, newCommand);
		} catch (err) {
			message.channel.send(CONSTANTS.errors.generic);
			throw new Error(err);
		}
		message.channel.send(`Command \`${commandName}\` was reloaded!`);

		break;
	}
	case ("ping"): {
		await message.channel.send("Loading...")
			.then((m) => {
				m.edit(`Pong! The latency is \`${m.createdTimestamp - message.createdTimestamp}ms\`. The API response time is \`${Math.round(client.ping)}ms\``);
			});
		break;
	}
	default: {
		// bot info embed
		message.channel.send("Loading...")
			.then((m) => {
				m.edit(new RichEmbed()
					.setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
					.setColor("DARK_BLUE")
					.setTimestamp()
					.addField("Library", "[Discord.JS](https://discord.js.org/)", true)
					.addField("Owner", "Ben.#0002", true)
					.addField("GitHub Repo", `[GitHub](${CONSTANTS.info.repo})`, true)

					.addField("Edit Time", `${m.createdTimestamp - message.createdTimestamp}ms`, true)
					.addField("API Response Time", `${Math.round(client.ping)}ms`, true)
					.addField("Version", (require("../../package.json")).version, true)
				);
			}
	);
			break;
		}
		}
	};

