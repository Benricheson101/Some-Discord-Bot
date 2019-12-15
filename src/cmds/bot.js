const { MessageEmbed } = require("discord.js");
const exec = (require("util").promisify((require("child_process").exec)));

module.exports.config = {
	name: "bot",
	aliases: [],
	ownerOnly: true,
	guildOnly: false,
	hidden: true
};

module.exports.run = async (client, message, args) => {
	let cmd = args.shift();
	args.slice(1);
	switch (cmd) {
	case ("destroy"): {
		message.channel.send("Refreshing...")
			.then(() => {
				client.destroy();
			})
			.then(() => {
				client.login(process.env.TOKEN)
					.catch((e) => {
						throw new Error(e);
					});
			});
		break;
	}
	case ("restart"): {
		message.channel.send("Shutting down...")
			.then(() => {
				client.destroy();
			})
			.then(() => {
				process.exit(0);
			});
		break;
	}
	case ("reload"): {
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);

		delete require.cache[require.resolve(`./${commandName}.js`)];

		try {
			const newCommand = require(`./${commandName}.js`);
			message.client.commands.set(newCommand.name, newCommand);
		} catch (err) {
			await message.channel.send(CONSTANTS.errors.generic);
			throw new Error(err);
		}
		await message.channel.send(`Command \`${commandName}\` was reloaded!`);

		break;
	}
	case ("ping"): {
		await message.channel.send("Loading...")
			.then((m) => {
				m.edit(`Pong! The edit time is \`${m.createdTimestamp - message.createdTimestamp}ms\` and the API response time is \`${Math.round(client.ws.ping)}ms\``);
			});
		break;
	}
	case ("eval"): {
		if (!args) return message.channel.send("");

		/**
		 * "Clean" text before returning it with eval.
		 * @param {string} text - Text to be "cleaned"
		 * @returns {string} - Cleaned text
		 */
		function clean (text) {
			if (typeof (text) === "string") {
				text = text.substring(0, 1000);
				return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
			}
			text = text.substring(0, 1000);
			return text;
		}

		try {
			const code = args.join(" ");
			let evaled = eval(code);
			if (typeof evaled !== "string") {
				evaled = require("util").inspect(evaled);
			}

			// TODO: make this shorter
			let successEmbed = new MessageEmbed()
				.setAuthor(message.author.username, message.author.icon_url)
				.setTitle("JavaScript Eval Success!")
				.setColor("GREEN")
				.setDescription(`\`\`\`js\n${args.join(" ")}\`\`\``)
				.addField("Result:", `\`\`\`xl\n${clean(evaled)}\`\`\``)
				.setTimestamp();
			await message.channel.send({ embed: successEmbed });

		} catch (err) {
			let errorEmbed = new MessageEmbed()
				.setAuthor(message.author.username, message.author.icon_url)
				.setTitle("JavaScript Eval Error!")
				.setColor("DARK_RED")
				.setDescription(`\`\`\`js\n${args.join(" ")}\`\`\``)
				.addField("Error:", `\`\`\`js\n${clean(err.stack)}\`\`\``)
				.setTimestamp();
			await message.channel.send({ embed: errorEmbed });
		}
		break;
	}
	case ("deploy"): {
		if (process.env.NODE_ENV !== "production" && args[0] !== "-f") return message.channel.send(":x: I am not running in the production environment. You probably don't want to deploy now."); // Don't deploy if the bot isn't running in the production environment
		let m = await message.channel.send("Loading...");
		let logMsg = await client.channels.get(CONSTANTS.config.logs).send("Loading...");
		await generateEmbed("Deploy command received");

		await generateEmbed("Updating code");
		exec("git fetch origin && git reset --hard origin/production") // Pull new code from the production branch on GitHub
			.then(async () => {
				await generateEmbed("Removing old node modules");
				return exec("rm -rf node_modules/"); // Delete old node_modules
			})
			.then(async () => {
				await generateEmbed("Installing new NPM packages");
				return exec("npm i --production"); // Installing any new dependencies
			})
			.then(async () => {
				await generateEmbed("Shutting down");
				return process.exit(0); // Stop the bot; Glitch should automatically restart the bot after it is shut down
			});

		/**
		 * Use an embed for deploy command logs
		 * @param {string} msg - The message to be logged
		 * @returns {Promise<void>}
		 */
		async function generateEmbed (msg) {
			if (typeof generateEmbed.message == "undefined") generateEmbed.message = [];
			generateEmbed.message.push(`- ${msg}`);
			let embed = new MessageEmbed()
				.setDescription(`\`\`\`md\n${generateEmbed.message.join("\n")}\`\`\``)
				.setColor("RANDOM");
			console.log(msg);
			if (m) await m.edit({ content: "", embed: embed });
			if (logMsg) await logMsg.edit({ content: "", embed: embed });
		}

		break;
	}
	case ("say"): {
		if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete();
		await message.channel.send(args.join(" "));
		break;
	}
	case ("delete"): {
		if (!args) return message.channel.send(":x: Please provide a message ID for me to delete. Alternatively, provide both a channel ID and message ID to delete from another channel.");
		if (args.length === 1) {
			return message.channel.message.fetch(args[0])
				.then((m) => m.delete())
				.then(message.react("👌"));
		} else {
			return client.channels.find((c) => c.id === args[0]).message.fetch(args[1])
				.then((m) => m.delete())
				.then(message.react("👌"));
		}
		break;
	}
	case ("gen"):
	case ("generate"): {
		let subCmd = args.shift();
		args.slice(1);
		switch (subCmd) {
		case ("cmdlist"):
		case ("cmds"): {
			await message.channel.send(
				client.commands.filter((cmd) => cmd.config.hidden === false).map((cmd) => {
					let command = `\`${CONSTANTS.config.prefix + cmd.config.name}\``;
					let aliases = cmd.config.aliases.length !== 0 ? ` aliases: \`${CONSTANTS.config.prefix + cmd.config.aliases.join(`, ${CONSTANTS.config.prefix}`)}\`` : "";
					return command + aliases;
				})
			);
			break;
		}
		default: {
			await message.channel.send(":x: Incorrect usage.");
			break;
		}
		}
		break;
	}
	case ("set"): {
		if (args.length < 2) return message.channel.send(":x: Incorrect usage.");
		let subCmd = args.shift();
		args.slice(1);
		switch (subCmd) {
		case ("status"): {
			await message.channel.send("Setting...")
				.then((m) => {
					client.user.setStatus(args[0]);
					return m;
				})
				.then((m) => {
					return m.edit("Done!");
				});
			break;
		}
		case ("activity"): {
			await message.channel.send("Setting...")
				.then((m) => {
					client.user.setActivity({
						name: args.join(" "),
						type: client.user.presence.activity.type
					});
					return m;
				})
				.then((m) => {
					return m.edit("Done!");
				});
			break;
		}
		case ("acttype"):
		case ("activitytype"): {
			if (!["PLAYING", "WATCHING", "LISTENING"].includes(args[0].toUpperCase())) return message.channel.send(":x: Incorrect usage.");
			await message.channel.send("Setting...")
				.then((m) => {
					client.user.setActivity({
						name: client.user.presence.activity.name,
						type: args[0].toUpperCase()
					});
					return m;
				})
				.then((m) => {
					return m.edit("Done!");
				});
			break;
		}
		default: {
			await message.channel.send(":x: Incorrect usage");
			break;
		}
		}
		break;
	}
	default: {
		let commit = await fetch("https://api.github.com/repos/Benricheson101/Some-Discord-Bot/commits/production")
			.then((res) => {
				return res.json();
			});
		message.channel.send("Loading...")
			.then((m) => {
					let date = new Date(commit.commit.author.date);
					m.edit({
						content: "",
						embed: new MessageEmbed()
							.setAuthor(`${message.author.tag}`, message.author.avatarURL())
							.setColor("RANDOM")
							.setTimestamp()
							.addField("Bot Info",
								`**Library**: [Discord.JS](https://discord.js.org/)
								**Developer**: Ben.#0002
								**GitHub Repo**: [GitHub](${(require("../../package.json")).homepage})
								**Latest Commit**: [${date.toISOString().replace("T", " ").split(".")[0]}](${commit.html_url})
								**Uptime:** ${(require("ms"))(client.uptime)}
								**UserID**: ${client.user.id}`,
								true
							)
							.addField("Other Info",
								`**Edit Time**: ${m.createdTimestamp - message.createdTimestamp}ms
								**API Response Time**: ${Math.round(client.ws.ping)}ms
								**Version**: ${(require("../../package.json")).version}
								**Node-ENV**: ${process.env.NODE_ENV}
								**Host**: [Glitch](https://glitch.com/)`,
								true
							)
					});
				}
			);
		break;
	}
	}
};

