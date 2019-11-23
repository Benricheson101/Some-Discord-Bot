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
	case ("ping"): {
		await message.channel.send("Loading...")
			.then((m) => {
				m.edit(`Pong! The latency is \`${m.createdTimestamp-message.createdTimestamp}ms\`. The API response time is \`${Math.round(client.ping)}ms\``)
			});
		break;
	}
	default: {
		// bot info embed
		message.channel.send(new RichEmbed()
			.setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
			.setColor("DARK_BLUE")
			.setTimestamp()
			.addField("Library", "[Discord.JS](https://discord.js.org/)", true)
			.addField("Owner", "Ben.#0002", true)
			.addField("GitHub Repo", `[GitHub](${CONSTANTS.info.repo})`, true)
		);
		break;
	}
	}
};

