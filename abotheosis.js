// Require the necessary discord.js classes
const { Client, Intents, Guild, MessageAttachment } = require('discord.js');
// const { DISCORD_TOKEN, TO_PARSE_ID } = require("./config.json");

// MD to PDF
const fs = require('fs');
const { Readable } = require('stream');
const markdownpdf = require("markdown-pdf");

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log(`Ready! Logged in as ${client.user.tag}`);
});

const parse_channel = (interaction, interactionId, parse_id) => {
	
	const channel = client.channels.cache.get(parse_id);
	const message_channel = client.channels.cache.get(interactionId);
	
	let text = "";
	
	const parse_text = (author, content) => {
		text += `# ${author}:\n` + `${content}\n\n`;
	}
	channel.messages.fetch({  }).then(messages => { // limit: 100
		messages = messages.reverse();
		console.log(`Received ${messages.size} messages`);
		interaction.reply({ content:`We're doing it! Received ${messages.size}.`, ephemeral:true });
		//Iterate through the messages here with the variable "messages".
		messages.forEach(message => parse_text(message.author.username, message.content))
		
		//// Still have access to all of text
		const m = new MessageAttachment( Buffer.from(text, 'utf-8'), `${new Date().toLocaleString()}-text.md` );

		// send message
		message_channel.send({
				content:`Save the Markdown file (.md) and use https://stackedit.io/app# to prettify it.`,
				files: [
					m // file attachment
				],
			})
			.then(console.log)
			.catch(console.error)
	})
}

// Work with commands
client.on('interactionCreate', async interaction => {
	if(!interaction.isCommand()) return;

	const { commandName }  = interaction;

	switch(commandName) {
		case "parse":
			parse_channel(interaction, interaction.channelId, process.env.TO_PARSE_ID); // #testing
			break;
		case "kill":
			await console.log('Good-bye, cruel world.');
			await client.destroy();
			break;
	}
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);