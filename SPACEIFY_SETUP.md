# Spaceify upload checklist

1. Download the repository ZIP from the GitHub link and extract it.
2. Upload the **contents** of the extracted project into `/home/container` so that `index.js` and `package.json` are directly in that directory. Do not upload a nested `yugen-core-main` folder as the only project folder.
3. Set the panel's **JS file / startup file** to `index.js`.
4. Make sure the install/start configuration installs dependencies from `package.json`. If the panel has an install command, use `npm install`; start command should be `npm start` (which runs `node index.js`) or the panel may directly run `node index.js`.
5. In Variables / Environment, set `DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, and `GUILD_ID=1560329418059153449`. Use the actual token only in the private hosting panel. Do not upload a real `.env` file to GitHub.
6. In Discord Developer Portal, enable **Server Members Intent** if welcome-on-join messages are wanted.
7. Ensure the bot is invited with `bot` and `applications.commands` scopes. Grant View Channels, Send Messages, Embed Links, Read Message History, and Manage Roles; no Administrator permission is needed.
8. Put the bot's role above the self-assignable roles in Server Settings → Roles.
9. Start/restart and inspect the console. Look for `Yūgen Core online as ...` and `Guild slash commands registered.`
10. Run `/setup` in the server as a member with Manage Roles and Manage Channels. It posts the interactive role menu in `#roles-and-interests`.

If startup fails, copy the console error (never the token) and troubleshoot from that error.
