const wait = (require("util")).promisify(setTimeout);
module.exports = async (client) => {
	console.log(`${client.user.username} is now online!`);

	await client.user.setPresence({
		game: {
			name: "Starting up..",
			type: "PLAYING"
		},
		status: "idle",
	});

	await wait(1000);

	await client.user.setPresence({
		game: {
			name: "idk what to put here :)",
			type: "WATCHING"
		},
		status: "dnd",
	});
};
