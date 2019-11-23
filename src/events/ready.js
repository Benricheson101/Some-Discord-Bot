const { promisify } = require("util");
const wait = promisify(setTimeout);
module.exports = async (client) => {
	console.log(`${client.user.username} is now online!`);

	await client.user.setActivity("Starting up...");

	await wait(5000);

	await client.user.setPresence({
		game: {
			name: "idk what to put here :)",
			type: "WATCHING"
		},
		status: "dnd",
	});
};
