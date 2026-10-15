require('dotenv').config();
const {
  ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, EmbedBuilder,
  Events, GatewayIntentBits, ModalBuilder, TextInputBuilder, TextInputStyle,
  SlashCommandBuilder, REST, Routes
} = require('discord.js');

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error('Missing DISCORD_TOKEN, DISCORD_CLIENT_ID, or GUILD_ID environment variable.');
  process.exit(1);
}

const COLORS = { dark: 0x242329, ivory: 0xF4F0E8, lavender: 0xB9A9D6, graphite: 0x77727E };
const ROLE_DEFS = [
  { name: 'Member', color: COLORS.graphite, id: 'role:member' },
  { name: 'MLBB', color: COLORS.lavender, id: 'role:mlbb' },
  { name: 'Competitive Player', color: COLORS.ivory, id: 'role:competitive-player' },
  { name: 'Culture Explorer', color: COLORS.lavender, id: 'role:culture-explorer' },
  { name: 'Creative', color: COLORS.graphite, id: 'role:creative' },
  { name: 'Event Ping', color: COLORS.ivory, id: 'role:event-ping' }
];
const commands = [
  new SlashCommandBuilder().setName('setup').setDescription('Create or refresh Yūgen’s self-role menu.'),
  new SlashCommandBuilder().setName('tryout').setDescription('Apply to find a team or join Yūgen competitive events.'),
  new SlashCommandBuilder().setName('about').setDescription('Learn about Yūgen Core.')
].map(c => c.toJSON());

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
const roleButton = (role, index) => new ButtonBuilder()
  .setCustomId(role.id).setLabel(role.name).setStyle(index % 3 === 0 ? ButtonStyle.Secondary : ButtonStyle.Primary);

async function ensureRoles(guild) {
  const result = [];
  for (const def of ROLE_DEFS) {
    let role = guild.roles.cache.find(r => r.name === def.name);
    if (!role) role = await guild.roles.create({ name: def.name, color: def.color, reason: 'Yūgen Core self-role setup' });
    result.push({ ...def, role });
  }
  return result;
}

client.once(Events.ClientReady, async readyClient => {
  console.log(`Yūgen Core online as ${readyClient.user.tag}`);
  try {
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log('Guild slash commands registered.');
  } catch (error) { console.error('Could not register slash commands:', error); }
});

client.on(Events.GuildMemberAdd, async member => {
  try {
    const channel = member.guild.channels.cache.find(c => c.name === 'welcome' && c.isTextBased());
    if (!channel) return;
    const embed = new EmbedBuilder().setColor(COLORS.dark)
      .setTitle('ようこそ · Welcome to Yūgen')
      .setDescription(`Welcome, ${member}!\n\nA world beyond the ordinary. Start with **#rules**, introduce yourself, and choose your interests in **#roles-and-interests**.`)
      .setFooter({ text: 'YŪGEN 影 · Discover beyond the ordinary' }).setTimestamp();
    await channel.send({ embeds: [embed] });
  } catch (error) { console.error('Welcome message failed:', error); }
});

client.on(Events.InteractionCreate, async interaction => {
  try {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === 'about') {
        return interaction.reply({ ephemeral: true, embeds: [new EmbedBuilder().setColor(COLORS.dark)
          .setTitle('Yūgen Core · 影').setDescription('A world beyond the ordinary. Community, culture, creativity, gaming, and competitive play — connected across borders.')
          .addFields({ name: 'Palette', value: '`#242329` charcoal · `#F4F0E8` ivory · `#B9A9D6` lavender' })] });
      }
      if (interaction.commandName === 'setup') {
        if (!interaction.memberPermissions?.has('ManageRoles') || !interaction.memberPermissions?.has('ManageChannels')) {
          return interaction.reply({ content: 'You need Manage Roles and Manage Channels to run setup.', ephemeral: true });
        }
        await interaction.deferReply({ ephemeral: true });
        const roles = await ensureRoles(interaction.guild);
        const channel = interaction.guild.channels.cache.find(c => c.name === 'roles-and-interests' && c.isTextBased());
        if (!channel) return interaction.editReply('I could not find #roles-and-interests. Create that channel, then run /setup again.');
        const rows = [
          new ActionRowBuilder().addComponents(...roles.slice(0, 3).map(roleButton)),
          new ActionRowBuilder().addComponents(...roles.slice(3).map((r, i) => roleButton(r, i + 3)))
        ];
        const embed = new EmbedBuilder().setColor(COLORS.dark).setTitle('✦ Find your place in Yūgen')
          .setDescription('Choose the roles that fit you. Tap a role again to remove it.\n\n**Member** — community access\n**MLBB** — Mobile Legends\n**Competitive Player** — tournaments and team play\n**Culture Explorer** — languages and culture\n**Creative** — art and making things\n**Event Ping** — event announcements')
          .setFooter({ text: 'YŪGEN 影 · Your world, your interests' });
        await channel.send({ embeds: [embed], components: rows });
        return interaction.editReply('Role menu posted. Make sure my role is above the roles I need to assign in Server Settings → Roles.');
      }
      if (interaction.commandName === 'tryout') {
        const modal = new ModalBuilder().setCustomId('tryout:submit').setTitle('Yūgen · Competitive application');
        const player = new TextInputBuilder().setCustomId('player').setLabel('In-game name / ID').setStyle(TextInputStyle.Short).setMaxLength(80).setRequired(true);
        const rank = new TextInputBuilder().setCustomId('rank').setLabel('Current rank / MMR').setStyle(TextInputStyle.Short).setMaxLength(80).setRequired(true);
        const role = new TextInputBuilder().setCustomId('role').setLabel('Main role / hero pool').setStyle(TextInputStyle.Short).setMaxLength(120).setRequired(true);
        const availability = new TextInputBuilder().setCustomId('availability').setLabel('Timezone and availability').setStyle(TextInputStyle.Paragraph).setMaxLength(300).setRequired(true);
        modal.addComponents(...[player, rank, role, availability].map(input => new ActionRowBuilder().addComponents(input)));
        return interaction.showModal(modal);
      }
    }

    if (interaction.isButton() && interaction.customId.startsWith('role:')) {
      const def = ROLE_DEFS.find(r => r.id === interaction.customId);
      if (!def) return interaction.reply({ content: 'That role is no longer available. Ask staff to refresh the menu.', ephemeral: true });
      const role = interaction.guild.roles.cache.find(r => r.name === def.name);
      if (!role) return interaction.reply({ content: 'This role needs to be recreated. Ask staff to run /setup.', ephemeral: true });
      const member = await interaction.guild.members.fetch(interaction.user.id);
      if (member.roles.cache.has(role.id)) {
        await member.roles.remove(role, 'Self-role removed through Yūgen Core');
        return interaction.reply({ content: `Removed **${role.name}**.`, ephemeral: true });
      }
      await member.roles.add(role, 'Self-role selected through Yūgen Core');
      return interaction.reply({ content: `Added **${role.name}**. Welcome to that corner of Yūgen.`, ephemeral: true });
    }

    if (interaction.isModalSubmit() && interaction.customId === 'tryout:submit') {
      await interaction.deferReply({ ephemeral: true });
      const staffChannel = interaction.guild.channels.cache.find(c => c.name === 'moderation-log' && c.isTextBased());
      if (!staffChannel) return interaction.editReply('Applications are temporarily unavailable. Please contact a moderator.');
      const embed = new EmbedBuilder().setColor(COLORS.lavender).setTitle('New competitive application')
        .setDescription(`Applicant: ${interaction.user} (${interaction.user.tag})`)
        .addFields(
          { name: 'In-game name / ID', value: interaction.fields.getTextInputValue('player') },
          { name: 'Rank / MMR', value: interaction.fields.getTextInputValue('rank') },
          { name: 'Main role / hero pool', value: interaction.fields.getTextInputValue('role') },
          { name: 'Timezone / availability', value: interaction.fields.getTextInputValue('availability') }
        ).setTimestamp();
      await staffChannel.send({ embeds: [embed] });
      return interaction.editReply('Application submitted privately to the Yūgen staff team. They’ll follow up when they can.');
    }
  } catch (error) {
    console.error('Interaction failed:', error);
    if (interaction.isRepliable() && !interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: 'Something went wrong. Please try again or contact staff.', ephemeral: true }).catch(() => {});
    } else if (interaction.isRepliable() && interaction.deferred) {
      await interaction.editReply('Something went wrong. Please try again or contact staff.').catch(() => {});
    }
  }
});

client.login(TOKEN);
