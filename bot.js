const Discord = require("discord.io");
const auth = require("./auth.json");
const got = require('got');


const scheduledMsgChannels = [
	"465479355309621250", // pobmenti
	"499268349310533646" // leander
];


let date = new Date();


// Initialize Discord Bot
let bot = new Discord.Client({
   token: auth.token,
   autorun: true
});


bot.on("ready", function (evt){
	console.log("Logged in as: " + bot.username + " - (" + bot.id + ")");

	let lastLeet = false;

	// Scheduled messages
	setInterval(function(){
		date = new Date();

		// L33t T1m3
		if (
			date.getHours() === 13 && date.getMinutes() === 37 &&
			(!lastLeet || lastLeet.getDate() !== date.getDate())
		){
			for (let i = 0; i < scheduledMsgChannels.length; i++){
				bot.sendMessage( {
					to: scheduledMsgChannels[i],
					message: "1t's L33t T1m3!"
				} );
			}

			lastLeet = new Date();
		}
	}, 5000);
});


bot.on("message", function (user, userID, channelID, message, evt){
	// Never let the bot respond to itself
	if (user === bot.username)
		return;

	// !Commands
	if (message.substring(0, 1) === "!"){
		console.log("input: " + message);

		let command = message.split(" ");

		switch (command[0]){
			// Youtube
			case "!yt":
				let searchString = message.substring(4);
				got("https://www.googleapis.com/youtube/v3/search?key=AIzaSyCobUh-zdhQuKHzfZ6iFx8bkX7FpVUcWuU&part=snippet&maxResults=1&type=video&q=" + searchString, { json: true }).then(response => {
					let vidId = response.body.items[0].id.videoId;
					let url = "https://www.youtube.com/watch?v=" + vidId;

					bot.sendMessage({
						to: channelID,
						message: url
					});

					console.log("output: " + url);
				}).catch(error => {
					console.log(error.response.body);
				});
				break;

			// Roll
			case "!roll":
				let min = 1;
				let max = 100;

				if (
					command[1] &&
					command [2] &&
					Number.isInteger(parseInt(command[1])) &&
					Number.isInteger(parseInt(command[2]))
				) {
					min = parseInt(command[1]);
					max = parseInt(command[2]);

					if (min > max) {
						let tmp = max;
						max = min;
						min = tmp;
					}
				}

				let roll = Math.floor(Math.random() * (max - min + 1)) + min;
				let msg = user + " rolled: " + roll + " (" + min + " - " + max + ")";

				bot.sendMessage({
					to: channelID,
					message: msg
				});


				console.log("output: " + msg);
				break;
		}
	}

	// L33t T1m3
	else if (date.getHours() === 13 && date.getMinutes() === 37){
		console.log("input: " + message);

		let leetMsg = message.replace(/a/g, "4");
		leetMsg = leetMsg.replace(/e/g, "3");
		leetMsg = leetMsg.replace(/i/g, "1");
		leetMsg = leetMsg.replace(/o/g, "0");

		bot.sendMessage({
			to: channelID,
			message: leetMsg
		});

		console.log("output: " + leetMsg);
	}
});


