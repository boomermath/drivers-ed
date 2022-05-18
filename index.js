require("dotenv").config();
const { Client, Intents } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const ping = require("./ping");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const command = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ping the website manually to check for updates");

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.CLIENT, process.env.GUILD), { body: [command.toJSON()] })
    .then(() => console.log("Command added"))
    .catch(console.error);

client.once('ready', async () => {
    console.log('Ready!');

    while (true) {
        const p = await ping();

        if (p !== false) {
            const channel = await client.channels.fetch(process.env.CHANNEL);

            if (channel) {
                channel.send(p);
                break;
            }
        }
    }
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName == "ping") {
        const res = await ping();

        if (res != false) {
            await interaction.reply(res);
        } else {
            await interaction.reply("No classes are currently open.")
        }
    }
})

client.login(process.env.TOKEN);

