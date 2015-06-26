$(document).ready( function() {

	var socket = io.connect('http://localhost:8080');

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
		$('.conversation').append($('<li>').append(
			$('<div class="username">').append(data.username + '&nbsp;-&nbsp;'),
			$('<div class="conversationMessage">').append(data.message)
		));
	});

});