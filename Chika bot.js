const Discord = require("discord.js");
const chika = new Discord.Client();

chika.on('ready', function() {
  console.log('I am ready!');
});

chika.on("message", function(message)
{
    chika.sendMessage(message, "Chika desu!", function(callback){
      console.log(callback);
    });
});

chika.loginWithToken("MjM5NTk2NjY0ODQxNTY4MjU3.Cu3FjA.Sf76JR4z1N6JWJwFeX67ShArwIE");
