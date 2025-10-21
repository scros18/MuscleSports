// Discord Bot for Customer Support Chat Replies
// Run with: node discord-bot.js
// 
// SETUP REQUIRED:
// 1. Create Discord bot at https://discord.com/developers/applications
// 2. Set token in .env.local as DISCORD_BOT_TOKEN
// 3. Invite bot to server with /commands permission
// 4. Run this bot and it will auto-register the /reply command

require('dotenv').config({ path: '.env.local' });
const { Client, GatewayIntentBits, REST, Routes, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const API_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4000';
const API_KEY = process.env.CHAT_REPLY_API_KEY || 'test-key';
const GUILD_ID = process.env.DISCORD_GUILD_ID || ''; // Optional: restrict to specific server

if (!BOT_TOKEN) {
  console.log('\n⏭️  DISCORD_BOT_TOKEN not configured - Discord bot will not run');
  console.log('📖 To enable Discord support, create .env.local with:\nDISCORD_BOT_TOKEN=your_token_here\n');
  process.exit(0);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Slash command definition
const commands = [
  {
    name: 'reply',
    description: 'Reply to a customer chat message',
    options: [
      {
        name: 'session_id',
        description: 'Session ID from the customer message (e.g., chat_xxxxx)',
        type: 3, // STRING
        required: true,
      },
    ],
  },
];

client.on('ready', async () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
  
  try {
    const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);
    
    // Register commands globally or to specific guild
    const endpoint = GUILD_ID 
      ? Routes.applicationGuildCommands(client.application.id, GUILD_ID)
      : Routes.applicationCommands(client.application.id);
    
    await rest.put(endpoint, { body: commands });
    console.log('✅ Slash commands registered!');
    console.log('� Usage: /reply <session_id>');
    console.log('💡 Example: /reply chat_1630161732543_au244nawd');
  } catch (error) {
    console.error('❌ Failed to register commands:', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'reply') {
    const sessionId = interaction.options.getString('session_id');
    
    // Create modal for reply
    const modal = new ModalBuilder()
      .setCustomId(`reply_modal_${sessionId}`)
      .setTitle('Reply to Customer');

    const nameInput = new TextInputBuilder()
      .setCustomId('reply_name')
      .setLabel('Your Name (e.g., Mike from Support)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setPlaceholder('e.g., Mike from Support Team');

    const messageInput = new TextInputBuilder()
      .setCustomId('reply_message')
      .setLabel('Your Reply')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setPlaceholder('Type your response here...')
      .setMaxLength(2000);

    const firstActionRow = new ActionRowBuilder().addComponents(nameInput);
    const secondActionRow = new ActionRowBuilder().addComponents(messageInput);

    modal.addComponents(firstActionRow, secondActionRow);
    await interaction.showModal(modal);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isModalSubmit()) return;

  if (interaction.customId.startsWith('reply_modal_')) {
    const sessionId = interaction.customId.replace('reply_modal_', '');
    const senderName = interaction.fields.getTextInputValue('reply_name');
    const message = interaction.fields.getTextInputValue('reply_message');

    await interaction.deferReply({ ephemeral: true });

    try {
      console.log(`📤 Sending reply for session: ${sessionId}`);
      
      const response = await fetch(`${API_URL}/api/chat/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          message,
          senderName,
          apiKey: API_KEY,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await interaction.editReply({
          content: `✅ **Reply Sent!**\n\n📝 From: **${senderName}**\n💬 Message: ${message}\n\n🆔 Session: \`${sessionId}\``,
        });
        console.log(`✅ Reply sent successfully!`);
      } else {
        throw new Error(data.error || 'Failed to send reply');
      }
    } catch (error) {
      console.error('❌ Error sending reply:', error);
      await interaction.editReply({
        content: `❌ **Error sending reply:**\n${error.message}`,
      });
    }
  }
});

client.login(BOT_TOKEN);

console.log('🚀 Discord bot starting...');
console.log('⏳ Waiting for bot to connect...');

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down bot...');
  client.destroy();
  process.exit(0);
});
