module.exports.config = {
	name: "bean",
	aliases: ["banbutwithana"],
	ownerOnly: false,
	guildOnly: true,
	hidden: false
};

module.exports.run = async (client, message, args) => {
	if (!message.member.hasPermission("BAN_MEMBERS", false, true, true) && !message.member.roles.find((r) => r.name === "Trusted")) {
		return message.channel.send(":x: You must have a role called `Trusted` to use this command!");
	}
	if (!args[0] || !getMember(args[0])) return message.channel.send(":x: You must mention someone or provide an ID of the user you would like to bean!");
	let user = getMember(args[0]);

	if (message.guild.member(user).hasPermission("BAN_MEMBERS", false, true, true) && message.author !== user) return message.channel.send(":x: I cannot bean this user.");

	message.channel.send(`:white_check_mark: ${user} was beaned by ${message.author} with reason: ${(args.slice(1)).join(" ") || "no reason"}`);

	/**
	 * Get a user
	 * @param user - Either a userId or a mention
	 * @returns {Collection<Snowflake, User>}
	 */
	function getMember (user) {
		if (!(isNaN(user))) { //if user is a number
			if (client.users.get(user)) return client.users.get(user);
			return null;
		}
		const match = user.match(/^<@!?(\d+)>$/);
		if (!match) return null;
		let id = match[1];
		return client.users.get(id);
	}
};

