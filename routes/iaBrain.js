var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');
var fs = require('fs');
var exec = require('child_process').exec;


exports.Analyse = function (askIn) {
    db.collections('Contact').findOne({ "_id": ObjectId(ctc._id) }, function (err, Contact) {
        if (Contact != null) {
            socket.emit("messageOUT", { message: { 'type': 'Contact', 'option': 'getOk', 'data': Contact } });
        };
        //console.dir(TempsList);

    });

    return askIn;
}

exports.Log = function (collections,askIn) {
    new collections.iaTchatLog(askIn).save(function (err) {

    });
    //return 0;
}

exports.CheckAuth = function (collections,UserSessionId) {
    console.log(UserSessionId);
    collections.Session.findOne({ "_id": UserSessionId,state : 'on'})
    .exec().then(function (UserSession) {
        console.log(UserSession);
        if (UserSession){
            return true;
        }else{
            return false;
        }
    })
}
