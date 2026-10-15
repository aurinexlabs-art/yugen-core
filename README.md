# Yūgen Core 影
**A world beyond the ordinary.** A custom Discord bot for the Yūgen community.

## Features
- Branded welcome message when a member joins (requires the Server Members Intent).
- `/setup` creates any missing self-assignable roles and posts an interactive role menu in `#roles-and-interests`.
- Members can toggle Member, MLBB, Competitive Player, Culture Explorer, Creative, and Event Ping roles.
- `/tryout` opens a competitive application form and sends submissions to the staff-only `#moderation-log`.
- `/about` explains the Yūgen identity and palette.
- Registers guild slash commands on startup.

## Upload to Spaceify (root startup file)
This package is intentionally arranged for a root-level startup file:
```
/home/container/
├── index.js
├── package.json
├── .env.example
├── .gitignore
├── README.md
└── SPACEIFY_SETUP.md
```
The startup file is **`index.js`**. The npm start command is **`node index.js`**. Do not move `index.js` into a `src` folder.

## Required private environment variables
Set these in Spaceify's **Variables / Environment** panel. Do not commit a real `.env` file or paste the bot token into chat.
- `DISCORD_TOKEN`: token from Discord Developer Portal → Bot → Reset Token / Token.
- `DISCORD_CLIENT_ID`: Application ID from Developer Portal → General Information.
- `GUILD_ID`: `1560329418059153449`.

## Discord Developer Portal and permissions
1. Enable **Server Members Intent** under Bot → Privileged Gateway Intents if you want join-welcome messages.
2. Invite the bot using OAuth2 URL Generator with `bot` and `applications.commands` scopes.
3. Grant only the permissions it needs: View Channels, Send Messages, Embed Links, Read Message History, and Manage Roles. Do **not** grant Administrator.
4. In Server Settings → Roles, move the bot's role above the six self-assignable roles.
5. Ensure the bot can view and send messages in `#welcome`, `#roles-and-interests`, and the private `#moderation-log`.

## Start and verify
- Install dependencies with `npm install` (or the host's install step).
- Start with `npm start` or configure the panel to run `index.js`.
- Successful startup should log `Yūgen Core online as ...` and `Guild slash commands registered.`
- Run `/setup` once as a server administrator who has **Manage Roles** and **Manage Channels**.

## Security
Never share or commit the bot token. If it is exposed, reset it immediately in the Developer Portal. The repository does not contain a real token.
