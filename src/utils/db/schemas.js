const { Schema, model } = require("mongoose");

const settings = new Schema({
	guildId: Number,
	prefix: { type: String, default: CONSTANTS.config.prefix }
});


module.exports = {
	settings: model("settings",settings)
};
