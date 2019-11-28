const SA = require("superagent");
module.exports.config = {
	name: "xkcd",
	aliases: [],
	ownerOnly: false,
	guildOnly: false
};

module.exports.run = async (client, message, args) => {
	let latest = await (SA.get("https://xkcd.com/info.0.json"))
		.then((res) => {
			return res.body;
		});

	if (!isNaN(args[0])) {
		if (args[0] > latest.num || args[0] < 1 || args[0] % 1 !== 0) return message.channel.send(`:x: That doesn't exist! Please choose a number between 1 and ${latest.num}.`);
		await generateEmbed((await SA.get(`https://xkcd.com/${args[0]}/info.0.json`)).body);
	} else if (args[0] === "latest") {
		await generateEmbed(latest);
	} else {
		await generateEmbed((await SA.get(`https://xkcd.com/${Math.floor(Math.random() * latest.num) + 1}/info.0.json`)).body);
	}

	/**
	 * Generate and send an embed with the JSON data.
	 * @param {Object} data - The JSON result
	 * @param {string} data.title - The comic title
	 * @param {number} data.num - The comic number
	 * @param {string} data.img - The image link
	 * @param {string} data.alt - The alt-text
	 * @returns {Promise<void>}
	 */
	function generateEmbed (data) {
		let embed = new (require("discord.js")).RichEmbed()
			.setTitle(data.title)
			.setAuthor(data.num)
			.setURL(`https://xkcd.com/${data.num}`)
			.setImage(data.img)
			.setFooter(data.alt)
			.setColor("#3485e7")
			.setTimestamp(new Date(data.year, data.month - 1, data.day));
		return message.channel.send(embed);
	}
};
