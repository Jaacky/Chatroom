var AccountController = function(userModel, session, mailer) {
	this.crypto = require('crypto');
	this.uuid = require('node-uuid');
    this.ApiResponse = require('../models/api-response.js');
    this.ApiMessages = require('../models/api-messages.js');
    this.UserProfileModel = require('../models/user-profile.js');
    this.userModel = userModel;
    this.session = session;
    this.mailer = mailer;
};

AccountController.prototype.getSession = function() {
	return this.session;
};

AccountController.prototype.setSession = function() {
	this.session = session;
};

AccountController.prototype.hashPassword = function(password, salt, callback) {
	// using pbkdf2 to hash and iterate 10k times by default
	var iterations = 10000,
		keylen = 64; // 64 bit
	this.crypto.pbkdf2(password, salt, iterations, keylen, callback);
};
 
module.exports = AccountController;