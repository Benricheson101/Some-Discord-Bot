const { RichEmbed } = require("discord.js");
module.exports.config = {
	name: "server",
	aliases: ["utils"],
	ownerOnly: false,
	guildOnly: false
};

module.exports.run = async (client, message, args) => {
	let cmd = args.shift();
	args.slice(1);
	switch (cmd) {
	case ("mention"):
	case ("ping"): {
		if (!message.member.hasPermission(268435456)) return message.channel.send(CONSTANTS.errors.noperms);
		if (!message.guild.me.hasPermission(268435456)) return message.channel.send(":x: I do not have permission to do that! Please ensure I have `MANAGE_ROLES`"); // Required permission: manage roles
		message.delete();
		if (!args.length) return message.channel.send(":x: Incorrect usage. Please put either a role ID or the role's name.");
		let role = message.guild.roles.find((role) => role.name === args.join(" ")) || message.guild.roles.get(args[0]);
		if (!role) return message.channel.send(":x: I cannot find that role. Please ensure you have copied the correct ID or spelled the role name correctly!");
		if (!role.editable) return message.channel.send(":x: I cannot edit this role. Please make sure I have a role above the role you are trying to mention.");

		let mentionable = role.mentionable;
		role.setMentionable(true, `Pinging role...`)
			.then(() => {
				return message.channel.send(role.toString());
			})
			.then(() => {
				return role.setMentionable(mentionable, `Role pinged by ${message.author.tag} (${message.author.id})`);
			});
		break;
	}
	default: {
		message.channel.send(":eyes:");
		break;
	}
	}
};

