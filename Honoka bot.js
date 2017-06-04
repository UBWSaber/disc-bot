var Discord = require("discord.js");
var fs = require("fs");
var linesFile = "C:\\Users\\Gordon\\Desktop\\a\\Discord bots\\lines.json";
var file1 = fs.readFileSync(linesFile);

var all_lines = JSON.parse(file1);

var lines = all_lines["lines1"];
var lines2 = all_lines["lines2"];
var lines3 = all_lines["lines3"];
//var cleverbot = require("cleverbot.io");
console.log("???");
//var bot2 = new cleverbot("zxQJgE2hS6Lc8HvK", "myaSMhMQWFvgMTGlruZak0isSk9iFMCB");
var bot = new Discord.Client();

var sound_path = "C:\\Users\\Gordon\\Desktop\\a\\Discord bots\\sound\\";

var mp3_paths = {
  "KAGUYA": sound_path + "kaguya.mp3",
  "WOOF": sound_path + "woof.mp3",
  "OKAERI": sound_path + "okaeri.mp3",
  "AWESOME": sound_path + "awesome.mp3",
  "HELPME": sound_path + "helpme.mp3",
  "ASMR": sound_path + "asmr.mp3",
  "POINT": sound_path + "point.mp3",
  "SAME": sound_path + "same.mp3",
  "RAGE": sound_path + "rage.mp3",
  "IGNITE": sound_path + "ignite.mp3",
  "KNOCK": sound_path + "knock.mp3",
  "TROLL": sound_path + "troll.mp3",
  "MESSAGE": sound_path + "message1.mp3",
  "FB": sound_path + "fb.mp3",
  "LOL1": sound_path + "HRIGHT.mp3",
  "MOAN": sound_path + "moan.mp3",
  "SENPAI": sound_path + "senpai.mp3",
  "NUNU": sound_path + "nunu.mp3",
  "AWESOME": sound_path + "awesome.mp3",
  "PIZZA": sound_path + "pizza.mp3",
  "TROLLING": sound_path + "trolling.mp3",
  "HELPME2": sound_path + "helpme2.mp3",
  "PANTSU": sound_path + "pantsu.mp3",
  "UWAH": sound_path + "uwah.mp3"
}

var message_text = {
  "honoka": "Hono, hono, ka~",
  "i love you": "I love you too!!",
  "special": [
      "GO OUT WITH ME",
      "MARRY ME",
      "DUO",
  ],
  "notspecial": "Oh.. sorry, but I can't do that for you",
  "call umi": "!umi",
}

var message_text_response = {
   "special": [
      "Ueeh??  Okay, but only because you're asking...",
      "I-I will!.. But just for you..",
      "Ehehe, of course! ♪",
      "J-Just this once, okay?",
      "I'd love to, just with you! Ehehe. ♪"
   ],
}

var last_message_dict = {};

var response_functions = {
    'random_line': send_random_line,
    'play_voice': join_voice_channel,
    'special_line': send_special_line
};

function decide_response_function(msg_pieces, message, honoka_role, input, is_me){
  if (msg_pieces[0] === "PLAY"){
      if (msg_pieces[1] === "YOUTUBE"){
         var youtube_data = {
              'link': msg_pieces[2],
              'seek': msg_pieces[3],
              'volume': msg_pieces[4],
         }

         join_voice_channel(msg_pieces, message, youtube_data);
      }
      else {
        response_functions['play_voice'](msg_pieces, message);
      }
  }
  else if (input === "HONOKA"){
      response_functions['random_line'](honoka_role, message, is_me);
  }
  else if (msg_pieces.indexOf("HONOKA") > -1) {
      response_functions['special_line'](message, msg_pieces, input);
  }
}

function play_youtube(youtube_data, voiceChannel) {
  const ytdl = require('ytdl-core');
  const streamOptions = { 'seek': youtube_data['seek'], 'volume': 0.1, 'passes': 10}
  voiceChannel.join()
  .then(connection => {
   const stream = ytdl(youtube_data['link'], { filter : 'audioonly' });
   const dispatcher = connection.playStream(stream, streamOptions);
  })
  .catch(console.error);

}

function send_random_line(honoka_role, message, is_me) {
  var new_list = lines;
  if (is_me || (honoka_role != null) && message.member.hasRole(honoka_role)){
      new_list = [lines, lines2];
      message.channel.send(random_line(random_line(new_list)));
  }
  else {
      message.channel.send(random_line(lines));
  }
}

function join_voice_channel(msg_pieces, message, youtube_data=false){
  if (!bot.voiceConnection){
    if (youtube_data == false){
      message.member.voiceChannel.join().then((connection) => playMP3(mp3_paths[msg_pieces[1]], connection));
    }
    else {
      play_youtube(youtube_data, message.member.voiceChannel)
    }
  }
  else if (bot.voiceConnection) {
    playMP3(mp3_paths[command[1]], bot.voiceConnection);
  }
}

function send_special_line(message, msg_pieces, input){

  honk_index = msg_pieces.indexOf("HONOKA")
  if (list_in_list(input, message_text['special']) > -1) {
      if (phrase_pos(msg_pieces, "HONOKA", message_text['special'][list_in_list(input, message_text['special'])], true, true)){
          //if (author.id == 101816989101592576 || ((honoka_role != null) && author.hasRole(honoka_role))){
          message.channel.send(random_line(message_text_response['special']));
          //}
      }
  }
  else{
      message.channel.send("?");
  }

}

function mentions_me(message){
    var mentions = Array.from(message.mentions.users.values())
    return mentions.includes(bot.user)
}

function relates_to_me(message){

    var author = message.member;
    var input = message.content.toUpperCase();
    var msg_pieces = input.split(" ");

    if (mentions_me(message) || msg_pieces.includes("HONOKA")){ //todo: last author detection
        return true;
    }
    else { return false; }
}

function phrase_pos(array, main, phrase, left, right){
    phrase_arr = phrase.split(" ");
    var leftc = true;
    var rightc = true;
    if (right){
        for (counter = 0; counter < phrase_arr.length; counter ++){
            if (Math.abs(array.indexOf(main) - array.indexOf(phrase_arr[counter])) != counter+1){
                console.log(rightc);
                rightc = false;
            }
        }
    }
    if (left){
        for (counter = 0; counter < phrase_arr.length; counter ++){
            if (Math.abs(array.indexOf(main) - array.indexOf(phrase_arr[counter])) != phrase_arr.length-counter){
                console.log(leftc);
                leftc = false;
            }
        }
    }

    return (rightc && right) || (leftc && left);
}

function list_in_list(list_main, list){
    inside=-2;
    for (counter=0; counter <list.length; counter++){
        if (list_main.indexOf(list[counter]) > -1){
            inside=counter;
        }
    }
    console.log(inside);
    return inside;
}

function get_index(value){
    return (this.value.indexOf(value));
}

function random_line(line_list){
    return line_list[Math.floor(Math.random() * line_list.length)];
}

function playMP3(filepath, voiceConnect){
  //fileKey is the key which corresponds to the filepath in the mp3_paths dictionary
  if(voiceConnect){
      voiceConnect.playFile(filepath, {volume: 0.8});
      console.log("Currently playing");
  }
}

function get_orig_link(message){
  yt_link = message.content.split(" ")[2];

  return yt_link;
}

var umi_id = 265578069216067595;
var umi_counter = 0;

bot.on("ready", function(err){
	console.log("Honoka is online!");
});

bot.on("message", function(message)
{
  var author = message.member;
  var is_umi = (author.id == umi_id);
  var is_me = (author.id == 101816989101592576);
  var honoka_role = message.guild.roles.get("name", "Honoka");
  var input = message.content.toUpperCase();
  var msg_pieces = input.split(" ");

  if (relates_to_me(message) || msg_pieces[0] === "PLAY"){
      if (msg_pieces[0] === "PLAY" && msg_pieces[1] === "YOUTUBE"){
          msg_pieces[2] = get_orig_link(message);
      }
      decide_response_function(msg_pieces, message, honoka_role, input, is_me);
  }

  if (input === "!UMI"){
      umi_counter ++;
  }
  if (umi_counter == 15){
      message.channel.send(random_line(lines3));
      umi_counter = 0;
  }
  if (is_umi){
      if (input.indexOf("SHAKE UR HEAD ONE MORE TIME U FUCKING RETARD") > -1){
          message.channel.send("I love umi-chan");
      }
  }

  last_message_dict[message.channel] = {
      'message': message
  };
});

bot.login("MzIwMzU5Njk2MTc3Mjk5NDU2.DBOVwQ.xW2PegD08IoX17GLzOG2i_H8zSI");





//bot.login("gordon.du97@gmail.com","you123red");

//unused code for reference
// var command = input.split(" ");
// if (command[0] === "PLAY"){
//   if (!bot.voiceConnection){
//     bot.joinVoiceChannel(message.author.voiceChannel, function(err, voiceConnection){
//       try{
//         playMP3(mp3_paths[command[1]], voiceConnection);
//       }
//       catch(err){
//         message.channel.send("Ahh... Ummm.. S-Something went wrong! Sorry!!");
//       }
//     });
//   }
//   else if (bot.voiceConnection) {
//     playMP3(mp3_paths[command[1]], bot.voiceConnection);
//   }
//
// }
// else if (command[0] === "HONOKA"){
//   var actual = message.content.substring(7);
//   console.log(actual);
//   if (!actual){
//       if (message.author.id == 101816989101592576){
//         bot.reply(message, lines2[Math.floor(Math.random() * lines2.length)]);
//       }
//       else {
//           message.channel.send(lines[Math.floor(Math.random() * lines.length)]);
//       }
//   }
//   else{
//       if (message_text[actual] != undefined)
//           message.channel.send(message_text[actual]);
//       else{
//           message.channel.send(message,"?");
//       }
//   }
// }
// else if (command[0] === "PLAY2"){
//   bot.joinVoiceChannel(message.author.voiceChannel, function(err, voiceConnection){
//     console.log("connected");
//       voiceConnection.playRawStream("http://www.youtube.com/get_video_info?&video_id=K_xTet06SUo");
//   });
// }
