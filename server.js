// Load the necessary servers.
var sys = require("sys"),
	express = require("express"),
	app = express();

var port = 8080,
	url = 'mongodb://localhost:27017/chatroom',
	io = require('socket.io').listen(app.listen(port));

var ip = require('ip').address();

// mongodb setup
var mongoClient = require('mongodb').MongoClient,
	mongoose = require('mongoose'),
	assert = require('assert'),
	uriUtil = require('mongodb-uri');

var mongodbUri = 'mongodb://admin:h3l1x@ds047458.mongolab.com:47458/helix',
	mongooseUri = uriUtil.formatMongoose(mongodbUri),
	options = {
		server: { socketOptions: { keepAlive:1, connectTimeoutMS: 30000 } },
		replset: { socketOptions: { keepAlive: 1, connecttimeoutMS: 30000} }
	};

mongoose.connect(mongooseUri, options);
var db = mongoose.connection;

db.on('connected', function() {
	console.log('Mongoose connection open to ' + mongooseUri);
});
db.on('error', function(err) {
	console.log('Mongoose connection error: ', err);
});
db.on('disconnected', function() {
	console.log('Mongoose connection disconnected');
});

process.on('SIGINT', function() {
	mongoose.connection.close(function() {
		console.log('Mongoose connection disconnected through app termination');
		process.exit(0);
	});
});

var Message = require('./server/models/message.js');

// Include index.html

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/index', function(req, res){
	res.render('index');
});

app.get('/jade-page', function(req, res) {
	res.render('page');
});

app.get('/chat-room', function(req, res) {
	//res.json(ip);
	res.render('chatroom');
});

io.sockets.on('connection', function(socket){
	socket.emit('welcome message', {message: 'Welcome to the chatroom'});
	console.log("A new connection");

	// display last 3 messages
	getRecentMessages(socket);

	socket.on('send', function(data) {
		io.sockets.emit('message', data);
	});

	socket.on('new message', function(data) {
		// Received new message
		storeMessage(data, function(message) {
			io.sockets.emit('new message', message);
		});
	});

	socket.on('received message', function(data) {
		console.log(data);
	});
});

function getRecentMessages(socket) {
	Message.find({}).limit(3).sort({timestamp: 'desc'}).exec(function(err, messages) {
		console.log("Getting old messages");
		console.log(!!messages.length);
		// if no old messages don't emit
		if (messages.length) {
			socket.emit("old messages", messages);
			console.log("Emitted old messages");
		}
		
	})
}

function storeMessage(data, callback) {
	var message = new Message({
		name: data.username,
		message: data.message
	});

	message.save(function(err, message) {
		if (err) {
			return console.error(err);
		}
		console.log("Saved message to database");
	});

	callback(message);
}

sys.puts("Server is running on 8080");

db.once('open', function(callback) {
	//var Message = require('./server/models/message.js');
	/*var newMessage = new Message({
		name: 'Me',
		message: 'Content/Message',
	});

	newMessage.save(function(err, newMessage){
		if (err) {
			return console.error(err);
		}
	});

	Message.find({name: /^M/}, function(err, messages) {
		if (err) return handleError(err);
		messages[0].display();
	});*/

});
