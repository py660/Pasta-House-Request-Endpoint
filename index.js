const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/assets'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/demo', function(req, res){
  res.sendFile(__dirname + '/template.html');
});

function trim(yourString, maxLength){ // Define trim function
  //var maxLength = 600 // maximum number of characters to extract
  
  //trim the string to the maximum length
  var trimmedString = (yourString.trim() + " ").substr(0, maxLength);
  
  //re-trim if we are in the middle of a word
  trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
  if (trimmedString == yourString){
    return trimmedString;
  }
  else{
    return trimmedString + "...";
  }
}

app.post('/submit', function(req, res){
  console.log(req.body);
  let body = req.body;
  cleaned = {
    name: trim(body.name, 50),
    desc: trim(body.desc, 200),
    about: trim(body.about, 600),
    data: trim(body.data, 2097152),
    usage: trim(body.usage, 300),
    author: trim(body.author, 50)
  }
  console.log(cleaned);
  console.log("-" * 70);
  res.render('index.html', { data: cleaned });
  let existing = JSON.parse(fs.readFileSync("db.json"));
  console.log(existing.bookmarklets);
  existing.bookmarklets.push(cleaned);
  console.log(existing.bookmarklets);
  fs.writeFileSync("db.json", JSON.stringify(existing, 0, 4));
});

app.get('/submit', function(req, res){
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});