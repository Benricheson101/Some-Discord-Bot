const wiki = require('wikijs').default;

module.exports.config = {
	name: "wikipedia",
	aliases: ["wiki"],
	ownerOnly: true,
	guildOnly: false
};

module.exports.run = async (client, message, args) => {
  let term;
  if (!args[0] || args[0] === "random") {
     term = await wiki()
    .random()
    .then((res) => {
      return res[0];
    });
  } else {
      term = await wiki()
      .search(args.join(" "))
      .then((data) => {
      return data.results[0];
    })
  }
  
  let res = await wiki()
  .page(term)
  .then(data => {
    return data;
  });
  
  //TODO: make this a function

  let embed = new (require("discord.js")).RichEmbed()
  .setTitle(res.raw.title)
  .setDescription((await res.summary()).substring(0, 2048))
  .setColor("RANDOM")
  .setURL(res.raw.fullurl);

  await res.mainImage ? embed.setImage(await res.mainImage()) : "";
  
message.channel.send(embed); 
};
