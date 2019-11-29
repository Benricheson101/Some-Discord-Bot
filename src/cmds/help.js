module.exports.config = {
	name: "help",
	aliases: [],
	ownerOnly: false,
	guildOnly: false
};

module.exports.run = async (client, message, args) => {
	message.channel.send("Figure it out yourself");
};

