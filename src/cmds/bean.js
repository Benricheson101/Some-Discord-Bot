module.exports.config = {
	name: "bean",
	aliases: ["banbutwithana"],
	ownerOnly: false,
	guildOnly: true,
	hidden: false,
	permissions: "0"
};

module.exports.run = async (client, message, args) => {
	if (!message.member.permissions.has("BAN_MEMBERS") && !message.member.roles.find((r) => r.name === "Trusted")) {
		return message.channel.send(":x: You must have a role called `Trusted` to use this command!");
	}
	if (!args[0] || !getMember(args[0])) return message.channel.send(":x: You must mention someone or provide an ID of the user you would like to bean!");
	let user = getMember(args[0]);

	if (message.member.roles.highest.comparePositionTo(user.roles.highest) < 0 && user.id !== client.user.id) return message.channel.send(":x: I cannot bean this user.");

	await message.channel.send(`:white_check_mark: ${user} was beaned by ${message.author} with reason: ${(args.slice(1)).join(" ") || "no reason"}`);

	/**
	 * Get a user
	 * @param user - Either a userId or a mention
	 * @returns {GuildMember | null}
	 */
	function getMember (user) {
		let member = message.guild.members.find((u) => u.id === user) || message.mentions.members.first();
		return member || null;
	}
};

