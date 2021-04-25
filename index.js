//Load express module with `require` directive
var express = require('express')
var app = express()//Define port
var port = 80//Define request response in root URL (/)
app.get('/', function (req, res) {
  res.send('Hello Schmidtys!')
})//Launch listening server on port 80
app.listen(port, function () {
  console.log('app listening...')
})
