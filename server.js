// init project
var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function(request, response) {
	response.sendFile(__dirname + '/public/index.html');
});

// listen for requests :)
app.listen('3000', function() {
	console.log('Your app is listening on port 3000');
});
