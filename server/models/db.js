var mongoose = require('mongoose');
var teamSchema = new mongoose.Schema({
	country: String,
	GroupName: String
});

mongoose.model('Team', teamSchema);
mongoose.connect('mongodb://localhost:27017/chatroom');