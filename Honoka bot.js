var Discord = require("discord.js");
var fs = require("fs");
var linesFile = "lines.json";
var file1 = fs.readFileSync(linesFile);
var Danbooru = require("danbooru");
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var all_lines = JSON.parse(file1);

var lines = all_lines["lines1"];
var lines2 = all_lines["lines2"];
var lines3 = all_lines["lines3"];
//var cleverbot = require("cleverbot.io");

//var bot2 = new cleverbot("zxQJgE2hS6Lc8HvK", "myaSMhMQWFvgMTGlruZak0isSk9iFMCB");
var bot = new Discord.Client();
var Booru = new Danbooru("SuddenPanic", "5ls4P7qQj2G7tn-qI4Qn32vfmovjULHDho7F-f0eeCs");

var picture_path = "pics/";

var sound_path = "sound/";

var pictures_paths = {
    'theone': picture_path + "theone.png",
    'honokashy': picture_path + "honokashy.gif"
}

var danbooru_tags = {
    'RIVEN': 'riven_(league_of_legends)'
}

var month_num = {
    "01": 0,
    "02": 1,
    "03": 2,
    "04": 3,
    "05": 4,
    "06": 5,
    "07": 6,
    "08": 7,
    "09": 8,
    "10": 9,
    "11": 10,
    "12": 11,
}

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
              'seek': msg_pieces[msg_pieces.indexOf("TIME") - 1],
              'volume': msg_pieces[msg_pieces.indexOf("VOLUME") - 1],
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
  const streamOptions = { seek: youtube_data['seek'], volume: youtube_data['volume'], passes: 1}
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
  // else{
  //     message.channel.send("?");
  // }

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

function daysBetween( date1, date2 ) {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;

  // Convert back to days and return
  return Math.round(difference_ms/one_day);
}

function parse_date(date_string){
    if (date_string.toUpperCase() == "TODAY"){
        date = new Date();
    }
    else if (date_string.toUpperCase() == "YESTERDAY"){
        date = new Date();
        date = new Date(new Date().setDate(new Date().getDate()-1))
    }
    else{
        date_string_array = date_string.split("-");

        year_num = Number(date_string_array[0]);
        mon_num = month_num[date_string_array[1]];
        date_num = Number(date_string_array[2]);

        date = new Date(year_num, mon_num, date_num);
    }
    return date;
}

function get_another_item(list, exists_list, item){
    if (exists_list.includes(item)){
        var new_item = list[Math.floor(Math.random()*list.length)];
        new_item = get_another_item(list, exists_list, new_item);
    }
    else {
        exists_list.push(item)
        return item;
    }
}

var search_image = async function(msg_pieces, message){
    var score_gt = [];
    var score_string = '';
    var tags = msg_pieces.slice(2,msg_pieces.length);
    var tag_string = String(tags);
    var random = !message.content.includes("RANDOM:TRUE");
    var limit = 10;
    var page = 1;
    var amount = 1;

    score_gt = tags.filter(function( obj ) {
      return obj.includes("SCORE>");
    });

    popular_tag = tags.filter(function( obj ) {
      return obj.includes("POPULAR:");
    });

    amount_tag = tags.filter(function( obj ) {
      return obj.includes("AMOUNT:");
    });

    if (amount_tag.length > 0){
      tags.splice(tags.indexOf(amount_tag[0]), 1)
      tag_string = String(tags) + " ";
      amount_value = amount_tag[0].split(":")[1];
      amount = Number(amount_value);

      if (amount > 4){
          message.channel.send("Too many images! Baka!!!");
          return;
      }
    }

    if (score_gt.length > 0){
      tags.splice(tags.indexOf(score_gt[0]), 1)
      tag_string = String(tags) + " ";
      var score_gt_array = score_gt[0].split(">");

        if (score_gt_array.length > 1){
            var score_min = Number(score_gt_array[1]);
            var score = String(Math.floor(Math.random() * (100 - score_min)) + score_min);

            score_string = "score:" + score;
        }
    }
    else if (popular_tag.length > 0){
      tags.splice(tags.indexOf(amount_tag[0]), 1)
      tag_string = String(tags) + " ";
      var popular_tag_array = popular_tag[0].split(":")

      if (popular_tag_array.length > 1){
          var today = new Date();
          var age_date = parse_date(popular_tag_array[1]);

          var days_diff = Math.abs(daysBetween(today, age_date));

          tag_string = "order:score " + "age:" + days_diff +"days";
      }

      page = 1;
      random = false;
      limit = 20;

    }

    if (tag_string.split(" ").length > 2){
        message.channel.send("Too many tags! Baka!!!");
    }
    if (tag_string.includes("order:")){
        random = false;
    }

    tag_string = tag_string.replace(",", " ");
    console.log(tag_string);
    if (random){
      var postArray = await(Booru.posts({
        limit: limit,
        tags: tag_string + score_string,
        random: random,
        page: page,
      }));
    }
    else {
       var postArray = await(Booru.posts({
        limit: limit,
        tags: tag_string + score_string,
        page: page,
      }));
    }
    //base url no longer required
    var source_link = "";//"http://danbooru.donmai.us";

    if (postArray.length <= 0){
        source_link = "No matches found!";
    }
    else if (postArray.length > 1){
      if (amount > 1){
        if (amount <= 4){
            var already_posted = []
            for (var i = 0; i < amount; i++) {

              var post = get_another_item(postArray, already_posted, postArray[Math.floor(Math.random()*postArray.length)])
              source_link = post.raw.file_url;

              message.channel.send(source_link);
            }

            return;
        }
        else{
            source_link = "Too many images! Baka!!!";
        }
      }
      else {
          var post = postArray[Math.floor(Math.random()*postArray.length)];
          source_link += post.raw.file_url;
      }
    }
    else{
        source_link += postArray[0].raw.file_urk;

    }
    message.channel.send(source_link);
    //message.channel.send("is this even the right repo");
};

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
  bot.user.setUsername("Honoka")
  if (input === "HONOKA STOP"){
    bot.voiceConnections.array()[0].disconnect();
  }

  if (input === "HONOKA SHOW ME THE ONE"){
    message.channel.send('', { files: [pictures_paths['theone']] });
  }

  if (msg_pieces[0] === "HONOKA" && msg_pieces[1] === "LEWD"){
    if (message.channel.id == 139536008734572544 || message.channel.id == 153707500070371328){
        // if (msg_pieces.length > 4){
        //    message.channel.send("There was an error!");
        // }
        // else{
        search_image(msg_pieces, message);
        // }
    }
    else {
        message.channel.send('https://cdn.discordapp.com/attachments/153707500070371328/320824984651956224/honokashy.gif');
    }
  }
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

//HOnoka login
bot.login("MzIwMzU5Njk2MTc3Mjk5NDU2.DBOVwQ.xW2PegD08IoX17GLzOG2i_H8zSI");

//Chika login
//bot.login("MjM5NTk2NjY0ODQxNTY4MjU3.DBVCiQ.A2ySg03qFMfkKSoPeJ4OcHw7kiQ");



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
