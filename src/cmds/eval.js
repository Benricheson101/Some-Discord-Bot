const vm = require("vm");
const { RichEmbed } = require("discord.js");
const { inspect } = require("util");

module.exports.config = {
	name: "eval",
	aliases: ["run"],
	ownerOnly: true,
	guildOnly: false
};

module.exports.run = async (client, message, args) => {
	function clean (text) {
		if (text.includes(client.token)) text.replace(client.token, "nice try");
		if (typeof (text) === "string") {
			text = text.substring(0, 1000);
			return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
		}
		text = text.substring(0, 1000);
		return text;
	}

	try {
		const code = args.join(" ");

		let evaled = eval(`(async () => { ${code} })()`)
			.catch((e) => {
				message.channel.send(`\`\`\`js\n${e}\`\`\``);
			});

		if (typeof evaled !== "string") {
			evaled = require("util").inspect(evaled);
		}

		let successEmbed = new RichEmbed()
			.setAuthor(message.author.username, message.author.icon_url)
			.setTitle("JavaScript Eval Success!")
			.setColor("GREEN")
			.setDescription(`\`\`\`js\n${args.join(" ")}\`\`\``)
			.addField("Result:", `\`\`\`xl\n${clean(evaled)}\`\`\``)
			.setTimestamp();
		message.channel.send(successEmbed);

	} catch (err) {
		let errorEmbed = new RichEmbed()
			.setAuthor(message.author.username, message.author.icon_url)
			.setTitle("JavaScript Eval Error!")
			.setColor("DARK_RED")
			.setDescription(`\`\`\`js\n${args.join(" ")}\`\`\``)
			.addField("Error:", `\`\`\`js\n${clean(err.stack)}\`\`\``)
			.setTimestamp();
		message.channel.send(errorEmbed);
	}

	/*	try {
			function parseCode (data) {
				const regex = /^(([ \t]*`{3,4})([^\n]*)([\s\S]+?)(^[ \t]*\2))/gm;
				// Regex from https://github.com/regexhq/gfm-code-block-regex/blob/master/index.js
				const result = regex.exec(data);
				console.log(result);
				//if (!result) return null;
				//if (result[3] !== "js") return result[3];
				return result[4];
			}

			const token = new RegExp(client.token, "g");
			const code = parseCode(args.join(" "));
			if (!code) return message.channel.send(`Your code must be in a codeblock.`);

			//let silent = (args.splice(-1)[0] === "shh");
			//console.log(silent);
			let silent = false;

			if (code) {
				const evaled = await vm.runInNewContext(`(async () => { ${code} })()`, {
					client,
					message,
					RichEmbed
				});

				let func = evaled;
				if (typeof func !== "string") {
					func = inspect(func);
				}
				if (func) {
					if (silent === false) {
						const embed = new RichEmbed()
							.setTitle("Javascript Eval")
							.setAuthor(message.author)
							.setTimestamp()
							.setColor("GREEN")
							.addField("Input", `\`\`\`js\n${code}\`\`\``)
							.addField("Output", `\`\`\`js\n${func.replace(token, "")}\`\`\``);

						if (Array.isArray(evaled) && token.test(evaled.join())) {
							return message.channel.send("no");
						} else {
							message.channel.send(embed);
						}
					} else {
						message.delete();
					}
				}
			} else {
				return message.channel.send(CONSTANTS.errors.generic)
					.then((m) => m.delete(5000));
			}
		} catch (e) {
			console.log("eeeeerrrrooooorrrrr");
			console.error(e);
			throw new Error(e);
		}*/
};

