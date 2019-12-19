const { MessageEmbed } = require("discord.js");
const { settings } = require("../utils/db/schemas");
module.exports.config = {
	name: "settings",
	aliases: ["cfg", "config"],
	ownerOnly: false,
	guildOnly: false,
	hidden: false,
	permissions: "32" // manage server
};

module.exports.run = async (client, message, args) => {
	//if (args.length < 2) return message.channel.send(":x: Incorrect usage.");
	if (!message.member.permissions.has(32)) return message.channel.send(CONSTANTS.errors.noperms);
	let setting = args[0];
	args = args.slice(1);

	settings.findOne({
		guildId: message.guild.id
	}, async (err, guild) => {
		if (err) throw new Error(err);
		switch (setting) {
		case ("prefix"): {
			if (args.length < 2) return message.channel.send(":x: Incorrect usage.");
			guild.prefix = args.join(" ");
			guild.save();
			await successEmbed("prefix", args.join(" "));
			break;
		}
		case ("show"):
		default: {
			console.log(guild);
			await message.channel.send(guild);
			break;
		}
		}

	});

	/**
	 * Generate an embed detailing what is being changed.
	 * @param {string} setting - The setting that is being changed.
	 * @param {string} value - What the setting is being changed to.
	 * @returns {MessageEmbed}
	 */
	function successEmbed (setting, value) {
		message.channel.send({
			embed: new MessageEmbed()
				.setAuthor(message.author.tag, message.author.iconURL)
				.setTitle("Configuration Change Applied.")
				.setDescription(`Successfully changed \`${setting}\` to \`${value}\``)
				.setColor("#34EB45")
				.setFooter(message.content)
				.setTimestamp()
		});
	}
};

