module.exports = async (client) => {
	console.log(`${client.user.username} is now online!`);

	await client.user.setPresence({
		game: {
			name: "idk what to put here :)",
			type: "WATCHING"
		},
		status: "dnd",
	});
};
