module.exports = async (client) => {
	console.log(`${client.user.username} is now online!`);

	await client.user.setPresence({
		game: {
			name: "idk what to put here :)",
			type: "WATCHING"
		},
		status: "dnd",
	});

	await client.channels.get("646109408446775376").send("I am online!");
};
