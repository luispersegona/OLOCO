const dotenv = require('dotenv');
if(process.env.NODE_ENV !== 'production')
    dotenv.config();

const { BOT_TOKEN } = process.env;

const Discord = require('discord.js');

const client = new Discord.Client();

const { token, default_prefix } = require('./config.json');

const config = require('./config.json');
client.config = config;

const db = require('quick.db')

const { readdirSync } = require('fs');

const { join } = require('path');


client.commands= new Discord.Collection();
const commandFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(join(__dirname, "commands", `${file}`));
    client.commands.set(command.name, command);
}


client.on("error", console.error);

client.on('ready', () => {
    console.clear();
    console.log("Bot Online");
    console.log("Bot Default Prefix is:", config.default_prefix)
    console.log("Logged in as:", client.user.tag)
   client.user.setActivity(".help | keyauth.com");  
});

client.on("message", async message => {

let prefix = await db.get(`prefix_${message.guild.id}`);
if(prefix === null) prefix = default_prefix;

    if (message.author.bot) return false;

    if (message.content.includes("@here") || message.content.includes("@everyone")) return false;

    if (message.mentions.has(client.user.id)) {
        const embed = new Discord.MessageEmbed()
        .setTitle('Help\n\n')
        .setThumbnail(client.user.displayAvatarURL())
	.addField('`setseller`', `Sets Seller Key. Run again to change applications \nArgs: **${prefix}setseller**`)
        .addField('`setprefix`', `Change the bot prefix. \nArgs: **${prefix}setprefix**`)
        .addField("Current Bot Prefix Is:", `\`${prefix}\``)
        .setColor("#00FFFF")
        .addField('`activate`', `Activate License Keys. \nArgs: **${prefix}activate**`, true)
        .addField('`addhwid`', `Add HWIDs to user. \nArgs: **${prefix}addhwid**`, true)
        .addField('`addsub`', `Create subscription. \nArgs: **${prefix}addsub**`, true)
        .addField('`addvar`', `Create Variable. \nArgs: **${prefix}addvar**`, true)
        .addField('`delunused`', `Delete Unused Licenses. \nArgs: **${prefix}delunused**`, true)
        .addField('`deluser`', `Delete users. \nArgs: **${prefix}deluser**`, true)
        .addField('`editvar`', `Edit variable data. \nArgs: **${prefix}editvar**`, true)
        .addField('`extend`', `Extend user expiry. \nArgs: **${prefix}extend**`, true)
        .addField('`resetuser`', `Reset user HWID. \nArgs: **${prefix}resetuser**`, true)
        .addField('`verify`', `Verify License Key. \nArgs: **${prefix}verify**`, true)
        .addField('`add`', `Add key(s). \nArgs: **${prefix}add**`, true)
        .addField('`del`', `Delete key. \nArgs: **${prefix}del**`, true)
        .addField('`info`', `Key Information. \nArgs: **${prefix}info**`, true)
		.addField('`stats`', `Application Statistics. \nArgs: **${prefix}stats**`, true)
        .addField('`reset`', `Reset key. \nArgs: **${prefix}reset**`, true)
		.addField('`upload`', `Upload File. \nArgs: **${prefix}reset**`, true)
        .setFooter('KeyAuth Discord Bot', client.user.displayAvatarURL())
        .setTimestamp()

        message.channel.send(embed)
    };


    if(message.content.startsWith(prefix)) {

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        if(!client.commands.has(command)) return;;
        if(!message.member.roles.cache.find(x => x.name == "perms")) return message.channel.send(`${message.author.toString()} does not have a role named \`perms\` and therefore cant execute any commands. If you're a server owner create role called that and give it to users you want to be able to execute commands`);
        try {
            message.delete();
            client.commands.get(command).run(client, message, args);
        } catch (error){
            console.error(error);
        }
    }

})


client.login(BOT_TOKEN);

    
