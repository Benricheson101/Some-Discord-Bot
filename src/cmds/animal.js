const missing = require("../utils/missingAnimals");
const unsplash = new (require("unsplash-js")).default({
	accessKey: process.env.UNSPLASHACCESSKEY
});

module.exports.config = {
	name: "animal",
	aliases: [],
	ownerOnly: false,
	guildOnly: false,
	hidden: false,
	permissions: "0"
};

module.exports.run = async (client, message, args) => {
	let animals = ["fox", "dog", "cat", "duck", "koala", "wolf", "redpanda", "panda", "otter", "dragon"];
	if (!args[0]) return message.channel.send(`:x: Incorrect usage. Correct usage: \`${CONSTANTS.config.prefix}animal <animal>\`. You can supply the following animals: \`${animals.join(", ")}\``);

	switch (args[0]) {
	case ("foxxo"):
	case ("fox"): {
		await generateEmbed({
			image: (await get("https://randomfox.ca/floof/")).body.image,
			fact: (await get("https://some-random-api.ml/facts/fox")).body.fact
		});
		break;
	}
	case ("doggo"):
	case ("puppy"):
	case ("dog"): {
		await generateEmbed({
			image: (await get("https://dog.ceo/api/breeds/image/random")).body.message,
			fact: (await get("http://dog-api.kinduff.com/api/facts")).body.facts
		});
		break;
	}
	case ("catto"):
	case ("kitten"):
	case ("cat"): {
		await generateEmbed({
			image: (await get("https://aws.random.cat/meow")).body.file,
			fact: (await get("https://catfact.ninja/fact")).body.fact
		});
		break;
	}
	case ("duck"): {
		await generateEmbed({
			image: (await get("https://random-d.uk/api/v2/random")).body.url
		});
		break;
	}
	case ("koala"): {
		await generateEmbed({
			image: (await get("https://some-random-api.ml/img/koala")).body.link
		});
		break;
	}
	case ("wolf"): {
		var wolf = {};
		let img = await unsplash.photos.getRandomPhoto({
			query: "wolf"
		})
			.catch((e) => { throw new Error(e); })
			.then((res) => res.json())
			.then((json) => {
				return json;
			});
		wolf.image = img.urls.regular;
		wolf.info = `Photo by ${img.user.name} on Unsplash.`;
		await generateEmbed(wolf);
		break;
	}
	case ("red-panda"):
	case ("redpanda"): {
		await generateEmbed({
			image: (await get("https://some-random-api.ml/img/red_panda")).body.link
		});
		break;
	}
	case ("suspense"):
	case ("panda"): {
		await generateEmbed({
			image: (await get("https://some-random-api.ml/img/panda")).body.link
		});
		break;
	}
	case ("otter"): {
		await generateEmbed({
			image: missing.otter[Math.floor(Math.random() * (missing.otter).length)]
		});
		break;
	}
	case ("dragon"): {
		let res = (await get("https://blue.catbus.co.uk/api/search?term=dragon+solo+feral+-young+-diaper+-overweight-traditional_media_%5C(artwork%5C)+-pregnant+rating:s+order:random&page=0&page_size=20&nsfw=false")).body.posts;
		let md5 = res[0].md5;

		await generateEmbed({
			image: `https://static1.e926.net/data/${md5.substr(0, 2)}/${md5.substr(2, 2)}/${md5}.${res[0].ext}`,
			title: `By: ${res[0].artist}`,
			url: res[0].sources[0],
		});
		break;
	}
	default: {
		await generateEmbed({
			image: "https://http.cat/404.jpg",
			info: "I don't have that animal yet!"
		});
		break;
	}
	}

	/**
	 * Generate and send an embed
	 * @param {Object} animal - Animal object
	 * @param {string} animal.image - The picture of an animal
	 * @param {string} [animal.fact] - Animal fact
	 * @param {string} [animal.info] - Any additional info (error message, picture credit, etc.)
	 * @param {string} [animal.url] - Another additional info field
	 * @param {string} [animal.title] - Another additional info field
	 * @returns {Promise<Message>}
	 */
	function generateEmbed (animal) {
		message.channel.send("Loading...")
			.then((m) => {
				let embed = new (require("discord.js")).MessageEmbed()
					.setColor("GREEN")
					.setImage(animal.image);
				animal.fact ? embed.setFooter(animal.fact) : "";
				animal.info ? embed.setAuthor(animal.info) : "";
				animal.title ? embed.setTitle(animal.title) : "";
				animal.url ? embed.setURL(animal.url) : "";
				return m.edit({ content: "", embed: embed });
			});
	}

	/**
	 * Make a GET request to a URL
	 * @param url {string} - The URL
	 * @returns {Object}
	 */
	function get (url) {
		return (require("superagent")).get(url)
			.timeout({
				response: 5000,
				deadline: 60000
			});
	}
};
