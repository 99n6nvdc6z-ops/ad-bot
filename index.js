require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  Events
} = require("discord.js");

const { DISCORD_TOKEN } = process.env;

if (!DISCORD_TOKEN) {
  console.error("Missing DISCORD_TOKEN.");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  console.log(`Received command: /${interaction.commandName}`);

  try {
    if (interaction.commandName === "send") {
      if (!interaction.guild) {
        return interaction.reply({
          content: "This command can only be used inside a server.",
          ephemeral: true
        });
      }

      const guild = await interaction.guild.fetch();

      const serverIcon = guild.iconURL({
        size: 1024
      });

      const serverName = guild.name;
      const serverDescription =
        guild.description || "No server description is set.";

      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle("Server Panel")
        .addFields(
          {
            name: "Server Name",
            value: serverName,
            inline: false
          },
          {
            name: "Server Description",
            value: serverDescription,
            inline: false
          }
        )
        .setFooter({
          text: `Server ID: ${guild.id}`
        })
        .setTimestamp();

      if (serverIcon) {
        embed.setThumbnail(serverIcon);
        embed.setImage(serverIcon);
      }

      return interaction.reply({
        embeds: [embed]
      });
    }
  } catch (error) {
    console.error("Interaction error:", error);

    if (interaction.replied || interaction.deferred) {
      return interaction.followUp({
        content: "Something went wrong while running this command.",
        ephemeral: true
      });
    }

    return interaction.reply({
      content: "Something went wrong while running this command.",
      ephemeral: true
    });
  }
});

client.login(DISCORD_TOKEN);
