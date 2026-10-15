# Yūgen Core 影

**A world beyond the ordinary.** A custom Discord bot for the Yūgen community.

## Current features

- Branded welcome message when a member joins (requires the Server Members Intent).
- `/setup` creates the self-role menu in `#roles-and-interests` and creates any missing roles.
- Self-role buttons for Member, MLBB, Competitive Player, Culture Explorer, Creative, and Event Ping.
- `/tryout` opens a private application form; applications are sent to the staff-only `#moderation-log` channel.
- `/about` displays the Yūgen identity and palette.
- Slash commands register to the configured server on startup.

## Required environment variables

Set these in your hosting provider's **environment/secret settings**, never in source code:

- `DISCORD_TOKEN` — bot token from Discord Developer Portal.
- `DISCORD_CLIENT_ID` — Application ID from General Information.
- `GUILD_ID` — Yūgen server ID (already shown in `.env.example`).

## Discord setup

1. Create an application at https://discord.com/developers/applications and add a Bot user.
2. Under **Bot**, enable **Server Members Intent** for welcome messages.
3. Invite the bot using OAuth2 URL Generator with `bot` and `applications.commands` scopes. Permissions needed: View Channels, Send Messages, Embed Links, Read Message History, Manage Roles. Do not grant Administrator.
4. In Server Settings → Roles, move the bot's role **above** the self-assignable roles it must grant. The bot needs Manage Roles.
5. Add the three environment variables to the host and deploy with `npm start`.
6. Run `/setup` as a server administrator with Manage Roles and Manage Channels permissions.

## Free hosting recommendation

For a gateway-connected Discord bot that should stay online 24/7, the strongest genuinely free option to investigate is **Oracle Cloud Infrastructure Always Free Compute**. It offers eligible VM resources at no charge, subject to account, region, capacity, and usage limits. Sign-up usually requires phone and card verification; Oracle says the card is not charged unless you upgrade. Always select resources explicitly marked **Always Free** and never upgrade to a paid plan just to make the bot work.

Official links:
- Oracle Free Tier: https://www.oracle.com/cloud/free/
- Oracle Always Free resources: https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm

Render's free web services spin down after 15 minutes without inbound traffic, so it is not a reliable fit for a persistent Discord gateway bot. A free tier can change; check current limits before deploying.

## Security notes

- Never commit `.env`, bot tokens, or recovery codes.
- If a token is exposed, reset it immediately in Discord Developer Portal.
- The bot does not request Administrator permissions.
- Review application content and staff channel permissions before accepting real applications.

## Stack

Node.js 20+ · discord.js 14 · SQLite not yet required (current version is stateless).
