const SA = require("superagent");
const Unsplash = require("unsplash-js");
const unsplash = new Unsplash.default({
	accessKey: process.env.UNSPLASHACCESSKEY
});

module.exports.config = {
	name: "animal",
	aliases: [],
	ownerOnly: false,
	guildOnly: false
};

module.exports.run = async (client, message, args) => {

	if (!args[0]) return message.channel.send(`:x: Incorrect usage. Correct usage: \`${CONSTANTS.config.prefix}animal <fox/dog/cat/duck>\``);

	switch (args[0]) {
	case ("foxxo"):
	case ("fox"): {
		await generateEmbed({
			image: (await SA.get("https://randomfox.ca/floof/")).body.image,
			fact: (await SA.get("https://some-random-api.ml/facts/fox")).body.fact
		});
		break;
	}
	case ("doggo"):
	case ("puppy"):
	case ("dog"): {
		await generateEmbed({
			image: (await SA.get("https://dog.ceo/api/breeds/image/random")).body.message,
			fact: (await SA.get("http://dog-api.kinduff.com/api/facts")).body.facts
		});
		break;
	}
	case ("catto"):
	case ("kitten"):
	case ("cat"): {
		await generateEmbed({
			image: (await SA.get("https://aws.random.cat/meow")).body.file,
			fact: (await SA.get("https://catfact.ninja/fact")).body.fact
		});
		break;
	}
	case ("duck"): {
		await generateEmbed({
			image: (await SA.get("https://random-d.uk/api/v2/random")).body.url,
			fact: "Quack"
		});
		break;
	}
	case ("koala"): {
		await generateEmbed({
			image: (await SA.get("https://some-random-api.ml/img/koala")).body.link,
			fact: (await SA.get("https://some-random-api.ml/fact/koala")).body.link
		});
		break;
	}
	case ("wolf"): {
		var wolf = {};
		let img = await unsplash.photos.getRandomPhoto({
			query: "wolf"
		})
			.then((res) => res.json())
			.then((json) => {
				return json;
			});
		wolf.image = img.urls.regular;
		wolf.fact = "insert fact here";
		wolf.credits = `Photo by ${img.user.name} on Unsplash.`;
		//console.log(img);
		await generateEmbed(wolf);
		break;
	}
	default: {
		await generateEmbed({
			image: "https://http.cat/404.jpg",
			fact: "I don't have that animal yet!"
		});
		break;
	}
	}

	/**
	 * @param {Object} animal - Animal object
	 * @param {string} animal.image - The picture of an animal
	 * @param {string} animal.fact - Animal fact
	 * @returns {Promise<void>}
	 */
	async function generateEmbed (animal) {
		await message.channel.startTyping();
		let embed = new (require("discord.js")).RichEmbed()
			.setColor("GREEN")
			.setImage(animal.image)
			.setFooter(animal.fact);
		animal.credits ? embed.setAuthor(animal.credits) : "";
		await message.channel.stopTyping(true);
		return message.channel.send(embed);
	}

	// Unsplash error handler
	unsplash.users.profile("naoufal")
		.catch((err) => {
			message.channel.send(new (require("discord.js")).RichEmbed()
				.setAuthor("something happened")
				.setTitle(err.message)
				.setDescription(`\`\`\`js\n${(err.stack).length >= 2048 ? (err.stack).substring(0, 2000) + " content too long..." : err.stack}\`\`\``)
				.setColor("DARK_RED")
				.setTimestamp()
			)
		});
};
