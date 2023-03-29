const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.post('/submit', function (req, res) {
  res.render('the_template', { name: req.body.name });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})