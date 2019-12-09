const wiki = require("wikijs").default;

module.exports.config = {
	name: "wikipedia",
	aliases: ["wiki"],
	ownerOnly: false,
	guildOnly: false,
	hidden: false
};

module.exports.run = async (client, message, args) => {
	let term;
	if (!args[0] || args[0] === "random") {
		term = await wiki()
			.random()
			.then((res) => {
				return res[0];
			});
	} else {
		term = await wiki()
			.search(args.join(" "))
			.then((data) => {
				return data.results[0];
			});
	}

	await generateEmbed(await wiki()
		.page(term)
		.then(data => {
			return data;
		}));

	/**
	 * Generate a Wikipedia embed
	 * @param data - the Wikipedia page data
	 * @returns {Promise<void>}
	 */
	async function generateEmbed (data) {
		let embed = new (require("discord.js")).MessageEmbed()
			.setTitle(data.raw.title)
			.setDescription((await data.summary()).substring(0, 2048))
			.setColor("RANDOM")
			.setURL(data.raw.fullurl);

		console.log(await data.mainImage());

		await data.mainImage ? embed.setImage(await data.mainImage()) : "";

		await message.channel.send(embed);
	}
};
