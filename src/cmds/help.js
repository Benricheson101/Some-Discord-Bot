module.exports.config = {
	name: "help",
	aliases: [],
	ownerOnly: false,
	guildOnly: false,
	hidden: false
};

module.exports.run = async (client, message, args) => {
	await message.channel.send("idk either tbh");
};
