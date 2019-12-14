const wait = (require("util")).promisify(setTimeout);
module.exports = async (client) => {
	await client.user.setPresence({
		activity: {
			name: "Starting up..",
			type: "PLAYING"
		},
		status: "idle"
	});

	await wait(1000);

	await console.log(`${client.user.username} is now online, serving ${client.users.size} users in ${client.guilds.size} guilds!`);
	await logger.ready(client);

	await client.user.setPresence({
		activity: {
			name: "idk what to put here :)",
			type: "WATCHING"
		},
		status: "dnd"
	});
};
