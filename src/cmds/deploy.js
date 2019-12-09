module.exports.config = {
	name: "deploy",
	aliases: [],
	ownerOnly: true,
	guildOnly: false,
	hidden: true
};

module.exports.run = async (client, message, args) => {
	await message.channel.send(":airplane_departure: Moved to `>bot deploy`");
};
