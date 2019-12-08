const development = {
	errors: {
		guildOnly: "This command cannot be used in DMs. Please try again in a server.",
		noperms: "You do not have permission to use this command.",
		generic: "An unhandled error has occurred. Please try again!"
	},
	superUsers: [
		"255834596766253057" // Ben.#0002
	],
	config: {
		prefix: "..",
		Logs: "652312009681010718"
	}
};
const production = {
	errors: {
		guildOnly: "This command cannot be used in DMs. Please try again in a server.",
		noperms: "You do not have permission to use this command.",
		generic: "An unhandled error has occurred. Please try again!"
	},
	superUsers: [
		"255834596766253057" // Ben.#0002
	],
	config: {
		prefix: ">",
		logs: "652288757755543623",
	}
};

module.exports = process.env.NODE_ENV === "production" ? production : development;
