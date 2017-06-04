
var fs = require("fs");

var readSource = "C:\\Users\\Gordon\\Desktop\\a\\Discord bots\\New Text Document.txt";

fs.readFile(readSource, "utf8", function(err, data){
  if ( err ){ throw err;}
  console.log("Reading file asynchronously");
  console.log(data);
});
