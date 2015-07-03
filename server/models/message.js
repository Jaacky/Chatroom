var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var messageSchema = mongoose.Schema({
	name: String,
	message: String,
	timestamp: {type: Date, default: Date.now}
});

messageSchema.methods.display = function() {
	var user = this.name
		? "Username is " + this.name
		: "Unknown username";

	console.log(user + " at this time: " + this.timestamp);
}

module.exports = mongoose.model('Message', messageSchema);