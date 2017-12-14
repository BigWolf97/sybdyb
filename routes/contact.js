
var ObjectId = require('mongodb').ObjectID;
var fs = require('fs');
var assert = require('assert');

exports.show = function (req, res, next) {
    res.render('contact',{usrSession:req.UserSession.type});
};
exports.new = function (req, res, next) {
    res.render('contactAdd',{usrSession:req.UserSession.type});
};
