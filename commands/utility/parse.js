const { SlashCommandBuilder, AttachmentBuilder, MessageFlags, ChannelType } = require('discord.js');
const { messages } = require('discord-fetch-all');
const { mdToPdf } = require('md-to-pdf');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('parse')
		.setDescription('Attempt to upload a formatted document of the channel.')
		.addChannelOption((option) => 
			option
				.setName('channel')
				.setDescription('The channel to parse and save')
				.addChannelTypes(ChannelType.GuildText)
				.setRequired(true))
		,
	async execute(interaction) {
		await interaction.reply({content: "Running..!", flags: MessageFlags.Ephemeral });
		const client = interaction.client;
		const parseChannel = client.channels.cache.get(process.env.CHANNEL_TO_PARSE_ID);
		// const parseChannel = interaction.options.getChannel('channel');
		const interactionChannel = client.channels.cache.get(interaction.channelId);
		
		let text = "";
	
		const parse_text = (author, content) => {
			text += `# ${author}:\n` + `${content}\n\n`;
		}
		
		const allMessages = await messages(parseChannel, { reverseArray: true });
		allMessages.forEach(message => parse_text(message.author.username, message.content));
		
		// Still have access to all of text
		const m = new AttachmentBuilder( Buffer.from(text, 'utf-8'), { name: `result-${new Date().toLocaleString()}-text.md` });
		const pdf = await mdToPdf({ content: text }).catch(console.error);

		let files = [m];
		if (pdf) {
			files[1] = new AttachmentBuilder( Buffer.from(pdf.content, 'application/pdf'), { name: `result-${new Date().toLocaleString()}.pdf` } );
		}

		// send message
		interactionChannel.send({
				content:`To customize further, save the Markdown file (.md) and use any Markdown exporting site to prettify it.`,
				files: files,
			})
			.then(console.log)
			.catch(console.error)
	}
}