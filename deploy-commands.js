const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { parse } = require('dotenv');
const { clientId, guildId, token } = require('./config.json');

const parse_command = new SlashCommandBuilder()
    .setName('parse')
    .setDescription('Attempt to upload a formatted document of the channel.')
    
const kill_command = new SlashCommandBuilder()
	.setName('kill')
	.setDescription('Terminate the bot. Bye bye!')

const commands = [
    parse_command,
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(
    Routes.applicationCommands(clientId), 
    { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);