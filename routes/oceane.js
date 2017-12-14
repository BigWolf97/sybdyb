
var ObjectId = require('mongodb').ObjectID;
var fs = require('fs');
var assert = require('assert');

exports.show = function (req, res, next) {
    if (req.UserSession){
        res.render('oceane',{usrSession:req.UserSession.type});
    } else{
        res.render('oceane');
    }
    
};
