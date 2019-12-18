module.exports.config = {
	name: "eval",
	aliases: [],
	ownerOnly: true,
	guildOnly: false,
	hidden: true,
	permissions: "0"
};

module.exports.run = async (client, message, args) => {
	await message.channel.send(":airplane_departure: Moved to `>bot eval`");
};
