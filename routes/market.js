var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');

exports.shop = function(req, res, next){
	var collections = req.collections;
	var shopId = req.params.id;
	if (req.UserSession){
		if (shopId){
			res.render('marketShop',{ usrSession:req.UserSession.type,user: req.UserSession.userName});
		};
	}
};
exports.hall = function(req, res, next){
	var collections = req.collections;
	if (req.UserSession){
		res.render('marketHall',{ usrSession:req.UserSession.type,user: req.UserSession.userName});
	}
};
