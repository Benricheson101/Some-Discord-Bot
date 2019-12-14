// Rename this file to "logger-setup.js"
const production = { // for development, either change this to development, or copy it and call it development
	cmd: {
		id: "",
		token: ""
	},
	join: {
		id: "",
		token: ""
	},
	other: {
		id: "",
		token: ""
	},
	ready: {
		id: "",
		token: ""
	}
};

module.exports = process.env.NODE_ENV === "production" ? production : development;
