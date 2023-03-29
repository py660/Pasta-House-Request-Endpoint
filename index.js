const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('html', require('ejs').renderFile);
app.use(express.static('assets'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/demo', function(req, res){
  res.sendFile(__dirname + '/template.html');
});

app.post('/submit', function (req, res) {
  console.log(req.body)
  res.render('index.html', { data: JSON.stringify(req.body) });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})