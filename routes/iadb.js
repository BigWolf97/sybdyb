var ObjectId = require('mongodb').ObjectID;
var fs = require('fs');
var assert = require('assert');

exports.show = function(req, res, next){
    var collections = req.collections;
	if (req.UserSession){
		res.render('iadb',{ usrSession:req.UserSession.type,user: req.UserSession.userName});
	}
};
