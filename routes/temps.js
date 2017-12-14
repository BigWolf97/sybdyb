
var ObjectId = require('mongodb').ObjectID;
var fs = require('fs');
var assert = require('assert');

exports.show = function (req, res, next) {
    res.render('temps',{usrSession:req.UserSession.type});
};

exports.add = function (req, res, next) {
    var collections = req.collections;

    var idArc = req.params.id;
    if (!idArc) return next(new Error('ID Archive Manquant.'));
    collections.archivesFiles.findOne({ "_id": new ObjectId(idArc) }, function (err, Arc) {
        if (Arc != null) {
            collections.archivesFiles.findOne({ "file": Arc._id }, function (err, ArcIdx) {
                if (ArcIdx != null) {
                    res.render('gererindex', { usrSession:req.UserSession.type,arcDoc: Arc, arcIdx: ArcIdx });
                } else {
                    res.render('gererindex', { usrSession:req.UserSession.type,arcDoc: Arc });
                };
            });
        };
    });
};
