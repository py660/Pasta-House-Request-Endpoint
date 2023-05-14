(async() => {

let RESET = false;

const express = require('express');
let   request = require('request');
const j = request.jar();
//console.log(process.env.PW);
const cookie = request.cookie('PW=' + process.env.PW);
const url = 'https://orange-red-rooster-coat.cyclic.app';
j.setCookie(cookie, url);

//console.log(j);

function write(filename, contents){
  return new Promise((resolve, reject) => {
    filename = filename || "tmp"
    request.put('https://orange-red-rooster-coat.cyclic.app/' + filename, {jar: j, headers: {'content-type' : 'application/json'}, body: contents, json: true}, (err, res, body) => {
      if (err) { console.log(err); reject(err); }
      //console.log(body)
      if (body == "ok"){
        resolve(body);
      }
      else{
        reject(body);
      }
    });
  })
}

function read(filename){
  return new Promise((resolve, reject) => {
    filename = filename || "tmp"
    request.get('https://orange-red-rooster-coat.cyclic.app/' + filename, {jar: j, json: true}, (err, res, body) => {
      if (err) { console.log(err); reject(err); }
      //console.log(body)
      if (res.statusCode != 200) {
        reject('Invalid status code: ' + response.statusCode);
      }
      resolve(body)
    });
  });
}

if (RESET){
  console.log(await write("db.json", {"bookmarklets": []}))
  console.log(await read("db.json"))
}
  
function timify(unix_timestamp){
  var date = new Date(unix_timestamp * 1000);
  // Hours part from the timestamp
  var hours = date.getHours();
  // Minutes part from the timestamp
  var minutes = "0" + date.getMinutes();
  // Seconds part from the timestamp
  var seconds = "0" + date.getSeconds();

  // Will display time in 10:30:23 format
  var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

  return formattedTime;
}

//const fs = require('fs');
//const fs = require('@cyclic.sh/s3fs') 
const app = express();
const port = 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/admin', async function(req, res){
  console.log(req.cookies);
  if (req.cookies.PW == process.env.PW){
    let existing = await read("db.json");
    res.render('admin.html', { data: existing });
  }
  else{
    res.send("<h1>403 Forbidden</h1><p>Shoo, get out of here.</p>")
  }
})

app.get('/view', async function(req, res){
  console.log(req.cookies);
  if (req.cookies.PW == process.env.PW){
    res.sendFile(__dirname + '/admin.html');
  }
  else{
    res.send("<h1>403 Forbidden</h1><p>Shoo, get out of here.</p>");
  }
})

app.get('/db.json', async function(req, res){
  if (req.cookies.PW == process.env.PW){
    let existing = await read("db.json");
    res.json(existing);
  }
  else{
    res.send("Unauthorized");
  }
})

app.put('/db.json', async function(req, res){
  if (req.cookies.PW == process.env.PW){
    write('db.json', req.json);
  }
  else{
    res.write("403 Forbidden")
  }
})

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

app.post('/submit', async function(req, res){
  
  console.log(req.body);
  let body = req.body;
  cleaned = {
    timestamp: Math.floor(Date.now()/1000),
    title: trim(body.name, 50),
    desc: trim(body.desc, 200),
    about: trim(body.about, 600),
    data: trim(body.data, 2097152),
    usage: trim(body.usage, 300),
    author: trim(body.author, 50)
  }
  console.log(cleaned);
  console.log("-" * 70);
  res.render('index.html', { data: cleaned, timify: timify });
  let existing = await read("db.json");
  //let existing = JSON.parse(fs.readFileSync("db.json"));
  console.log(existing.bookmarklets);
  existing.bookmarklets.push(cleaned);
  console.log(existing.bookmarklets);

  write("db.json", existing);
  //fs.writeFileSync("db.json", JSON.stringify(existing, 0, 4));
});

app.get('/submit', function(req, res){
  res.redirect('/');
});

app.get('/after', function(req, res){
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


})();
