
exports.show = function (req, res, next) {
	//console.log(req.UserSession.type);
	res.render('config',{usrSession:req.UserSession.type});
};

