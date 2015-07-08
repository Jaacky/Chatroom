$(document).ready( function() {

	//var socket = io.connect('http://localhost:8080');
	var socket = io.connect('http://54.173.137.187');
	$('form').submit( function(data) {

		socket.emit(
			'new message',
			{
				message: $('#message').val(), 
				username: $('#username').val()
			}
		);
		//console.log($('#message').val());
		$('#message').val('');
		return false;
	});

	socket.on('welcome message', function(data) {
		$('.conversation').append($('<li id="welcome">').append(data.message));
		//socket.emit('received message', {received: data});
	});

	socket.on('new message', function(data) {
		console.log(data);
		timestamp = new Date(data.timestamp);
		$('.conversation').append($('<li>').append(
			$('<div class="username">').append('[' + timestamp.toLocaleString() + '] ' + data.name + '&nbsp;-&nbsp;'),
			$('<div class="conversationMessage">').append(data.message)
		));
	});

	socket.on('old messages', function(data) {
		console.log("received old messages");
		var testDate = new Date(data[1].timestamp);
		console.log(data[1].timestamp);
		console.log(testDate.toLocaleString());
		for (var i=(data.length - 1); i >= 0; i--) {
			var timestamp = new Date(data[i].timestamp);
			$('.conversation').append($('<li>').append(
				$('<div class="username">').append('[' + timestamp.toLocaleString() + '] ' + data[i].name + '&nbsp;-&nbsp;'),
				$('<div class="conversationMessage">').append(data[i].message)
			));
		}
	});

});
