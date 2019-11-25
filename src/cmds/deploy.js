module.exports.config = {
	name: "deploy",
	aliases: [],
	ownerOnly: true,
	guildOnly: false
};

module.exports.run = async (client, message, args) => {
	message.channel.send(":airplane_departure: Moved to `>bot deploy`");
};
