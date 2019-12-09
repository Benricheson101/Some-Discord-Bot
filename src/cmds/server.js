module.exports.config = {
	name: "server",
	aliases: ["utils"],
	ownerOnly: false,
	guildOnly: true,
	hidden: false
};

module.exports.run = async (client, message, args) => {
	let cmd = args.shift();
	args.slice(1);
	switch (cmd) {
	case ("mention"):
	case ("ping"): {
		// TODO: make this less ugly
		if (!message.member.permissions.has(268435456)) {
			return message.channel.send(CONSTANTS.errors.noperms)
				.then((m) => m.delete({ timeout: 5000 }));
		}
		if (!message.guild.me.permissions.has(268435456)) {
			return message.channel.send(":x: I do not have permission to do that! Please ensure I have `MANAGE_ROLES`") // Required permission: manage roles
				.then((m) => m.delete({ timeout: 5000 }));
		}
		message.delete();

		if (!args.length) {
			return message.channel.send(":x: Incorrect usage. Please put either a role ID or the role's name.")
				.then((m) => m.delete({ timeout: 5000 }));
		}
		let role = message.guild.roles.find((role) => role.name === args.join(" ")) || message.guild.roles.get(args[0]);
		if (!role) {
			return message.channel.send(":x: I cannot find that role. Please ensure you have copied the correct ID or spelled the role name correctly!")
				.then((m) => m.delete({ timeout: 5000 }));
		}
		if (!role.editable) {
			return message.channel.send(":x: I cannot edit this role. Please make sure I have a role above the role you are trying to mention.")
				.then((m) => m.delete({ timeout: 5000 }));
		}

		let mentionable = role.mentionable;
		if (!role.editable && !mentionable) return message.channel.send(":x: I cannot edit this role. Please make sure I have a role above the role you are trying to mention.");

		if (role.mentionable) return message.channel.send(role.toString());
		role.setMentionable(true, `Pinging role...`)
			.then(() => {
				return message.channel.send(role.toString());
			})
			.then(() => {
				return role.setMentionable(mentionable, `Role pinged by ${message.author.tag} (${message.author.id})`);
			});
		break;
	}
	case ("gen"):
	case ("generate"): {
		let subCmd = args.shift();
		args.slice(1);
		switch (subCmd) {
		case ("emojilist"):
		case ("emojis"): {
			if (!message.member.permissions.has("MANAGE_EMOJIS")) return message.channel.send(CONSTANTS.errors.noperms);
			let staticEmojis = message.guild.emojis
				.filter((emoji) => emoji.animated === false)
				.map((emoji) => {
					return `<:${emoji.name + ":" + emoji.id}>`;
				});
			let animatedEmojis = message.guild.emojis
				.filter((emoji) => emoji.animated === true)
				.map((emoji) => {
					return `<a:${emoji.name + ":" + emoji.id}>`;
				});
			await message.channel.send(
				`**Static Emojis**:\n` +
				(staticEmojis.length !== 0 ? staticEmojis : "None") +
				`\n **Animated Emojis**:\n` +
				(animatedEmojis.length !== 0 ? animatedEmojis : "None")
			);
			break;
		}
		default: {
			await message.channel.send(":x: Invalid usage.");
		}
		}
		break;
	}
	default: {
		await message.channel.send(":eyes:");
		break;
	}
	}
};
