const SA = require("superagent");
module.exports.config = {
	name: "xkcd",
	aliases: [],
	ownerOnly: false,
	guildOnly: false
};

module.exports.run = async (client, message, args) => {

	/*if (!isNaN(args[0])) {
		let data = (await SA.get(`https://xkcd.com/${args[0]}/info.0.json`))
			.then((res, err) => {
				if (err && err.status !== "200") return await (SA.get("https://xkcd.com/info.0.json")).body;
				return res.body;
			});

		await generateEmbed(data);
	}*/
	await generateEmbed(
		await (SA.get("https://xkcd.com/info.0.json"))
			.then((res) => {
				return res.body;
			})
	);

	/**
	 * @param {Object} data
	 * @param {string} data.title - The comic title
	 * @param {string} data.num - The comic number
	 * @param {string} data.img - The image link
	 * @param {string} data.alt - The alt-text
	 * @returns {Promise<void>}
	 */
	function generateEmbed (data) {
		let embed = new (require("discord.js")).RichEmbed()
			.setTitle(data.title)
			.setURL(`https://xkcd.com/${data.num}`)
			.setImage(data.img)
			.setFooter(data.alt)
			.setTimestamp(new Date(data.year, data.month - 1, data.day));
		return message.channel.send(embed);
	}

};
