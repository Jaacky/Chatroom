// Load the necessary servers.

var sys = require("sys");
var express = require("express");
var app = express();
//var http = require("http").Server(app);
//var io = require('socket.io')(http);
var port = 8080;

// Include index.html

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/chatroom', function(req, res) {
	res.sendFile(__dirname + '/chatroom.html');
});

app.get('/jade-page', function(req, res) {
	res.render('page');
});

app.get('/chat-room', function(req, res) {
	res.render('chatroom');
});

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function(socket){
	socket.emit('welcome message', {message: 'Welcome to chat'});

	socket.on('send', function(data) {
		io.sockets.emit('message', data);
	});

	socket.on('new message', function(data) {
		//console.log(data);
		io.sockets.emit('new message', data);
	});

	socket.on('received message', function(data) {
		console.log(data);
	});
});

/*
io.on('connection', function(socket) {
	socket.on('chat message', function(msg) {
		io.emit('chat message', msg);
	});
});

http.listen(8080, function() {
	console.log('Listening on *:8080');
});
*/
// For logging...

sys.puts("Server is running on 8080");
