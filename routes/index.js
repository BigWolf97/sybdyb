exports.archive = require('./archive');
exports.temps = require('./temps');
exports.contact = require('./contact');
exports.iadb = require('./iadb');
exports.config = require('./config');
exports.market = require('./market');
exports.oceane = require('./oceane');

exports.index = function(req, res, next){
    console.log(req.sessionID);
    var originalUrl= '/';
    if (req.originalUrl){
        originalUrl=  req.originalUrl;
    }    
    res.render('indexAlt',{ SessId: req.sessionID, originalUrl: originalUrl});
};



