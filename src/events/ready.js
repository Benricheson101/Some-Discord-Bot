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

	await console.log(`[I] [${process.env.NODE_ENV}] ${client.user.tag} is now online\n	Users: ${client.users.size}\n	Guilds: ${client.guilds.size}\n	Channels: ${client.channels.size}`);
	await logger.ready(client);

	await client.user.setPresence({
		activity: {
			name: "idk what to put here :)",
			type: "WATCHING"
		},
		status: "dnd"
	});
};
