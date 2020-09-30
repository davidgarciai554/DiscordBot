const Discord = require('discord.js');

const client = new Discord.Client();

const prefix = '+';

const ytdl = require("ytdl-core");

const fs = require('fs');
const { runInContext } = require('vm');

var servers = {};

client.command = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.command.set(command.name, command);
}
client.once('ready', () => {
    console.log('ChinorrisBot is online');
})
client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    let args = message.content.slice(prefix.length).split(" ");
    const command = args.shift().toLowerCase();


    if (command === 'ping') {

        message.channel.send('pong');

    } else if (command === 'join') {

        const { voice } = message.member
        if (!voice.channelID) {
            message.channel.send("Entra en un canal");
            return;
        }
        
        voice.channel.join()
        message.channel.send("He entrado!");

    } else if (command === 'leave') {

        const { voice } = message.member
        
        if (!voice.channelID) {
            message.channel.send("No estoy en ningun canal");
            return;
        }
        
        voice.channel.leave();
        message.channel.send("Me voy!");

    } else if (command === 'play') {
        args = message.content.substring(prefix.length).split(" ");

        function play(connection, message) {
            var server = servers[message.guild.id];

            server.dispatcher = connection.play(ytdl(server.queue[0], {filter:"audioonly"}));

            server.queue.shift();

            server.dispatcher.on("end", function () {
                if (server.queue[0]) {
                    play(connection, message);
                } else {
                    connection.disconnect();
                }
            })
        }

        if (!args[1]) {
            message.channel.send("Envia un enlace!");
            return;
        }
        const { voice } = message.member
        if (!voice.channelID) {
            message.channel.send("Entra en un canal");
            return;
        }

        voice.channel.join()

        if (!servers[message.guild.id]) servers[message.guild.id] = {
            queue: []
        }

        var server = servers[message.guild.id];

        server.queue.push(args[1]);

        if (!message.guild.voiceConnection) message.member.voice.channel.join().then(function (connection) {
            play(connection, message);
        })

    }
    else {
        message.channel.send('No te entiendo toy xiquito');
    }
})

client.login('');