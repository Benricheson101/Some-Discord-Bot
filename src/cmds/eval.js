module.exports.config = {
	name: "eval",
	aliases: ["run"],
	ownerOnly: true,
	guildOnly: false
};

module.exports.run = async (client, message, args) => {
	message.channel.send(":airplane_departure: Moved to `>bot eval`")
};
