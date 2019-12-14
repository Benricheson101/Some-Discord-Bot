// rename to logger-setup.js
const development = {}; // same as development
const production = {
	cmd: {
		enabled: true, // Setting this to false will not send any logs. If you make it false, you do not need to set id/token.
		id: "",
		token: "",
	},
	join: {
		enabled: true,
		id: "",
		token: "",
	},
	leave: {
		enabled: true,
		id: "",
		token: "",
	},
	other: {
		enabled: true,
		id: "",
		token: ""
	},
	ready: {
		enabled: true,
		id: "",
		token: ""
	},
	exit: {
		enabled: true,
		id: "",
		token: ""
	},
	emojis: {
		// still: <:name:id> | animated: <a:name:id> | unicode: 🛠️ | twemoji: :tools:
		// leave these blank to not use any emoji. Removing them will cause an error
		tools: "",
		plus: "",
		minus: "",
		log: "",
		power: "",
		x: ""
	}
};
module.exports = process.env.NODE_ENV === "production" ? production : development;
