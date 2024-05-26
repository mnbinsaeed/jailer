const { REST, Routes } = require('discord.js');
require('dotenv').config();

const { BOT_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

const commands = [
  {
    name: 'sjn',
    description: 'Send a user to jail',
    options: [
      {
        name: 'target',
        type: 'USER',
        description: 'The user to jail',
        required: true,
      },
    ],
  },
  {
    name: 'unsjn',
    description: 'Release a user from jail',
    options: [
      {
        name: 'target',
        type: 'USER',
        description: 'The user to release',
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: '9' }).setToken(BOT_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
