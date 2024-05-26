const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates] });

let jailChannel = null;
const jailedUsers = new Set();

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
  const member = newState.member;
  if (jailedUsers.has(member.id) && newState.channelId !== jailChannel.id) {
    await member.voice.setChannel(jailChannel);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'sjn') {
    const member = options.getMember('target');
    if (!jailChannel) {
      jailChannel = await interaction.guild.channels.create('Jail', { type: 'GUILD_VOICE' });
    }
    await member.voice.setChannel(jailChannel);
    await member.voice.setMute(true);
    jailedUsers.add(member.id);
    await interaction.reply(`${member.user.tag} has been jailed.`);
  } else if (commandName === 'unsjn') {
    const member = options.getMember('target');
    if (jailedUsers.has(member.id)) {
      await member.voice.setMute(false);
      jailedUsers.delete(member.id);
      await interaction.reply(`${member.user.tag} has been released.`);
  }
}});

client.login(process.env.BOT_TOKEN);

app.get('/', (req, res) => {
  res.send('Bot is running');
});

module.exports = app;
