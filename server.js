// Load the necessary servers.

var sys = require("sys");
var app = require("express")();
var http = require("http").Server(app);
var io = require('socket.io')(http);

// Include index.html

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	socket.on('chat message', function(msg) {
		io.emit('chat message', msg);
	});
});

http.listen(8080, function() {
	console.log('Listening on *:8080');
});

// For logging...

sys.puts("Server is running on 8080");
