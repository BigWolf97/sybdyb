var ObjectId = require('mongodb').ObjectID;
var fs = require('fs');
var assert = require('assert');

exports.show = function(req, res, next){
	//var collections = req.collections;
    res.render('archive',{usrSession:req.UserSession.type});
};

exports.add = function (req, res, next) {
    res.render('addarchive',{usrSession:req.UserSession.type});
};

exports.config = function(req, res, next){
    res.render('configIdx',{usrSession:req.UserSession.type});
};

exports.addidx = function (req, res, next) {
    var collections = req.collections;

    var idArc = req.params.id;
	if (!idArc) return next(new Error('ID Archive Manquant.'));
	//console.log(idArc);
	collections.archivesFiles.findOne({ "_id": new ObjectId(idArc) }, function (err, Arc) {
		//console.log(Arc);
		if (Arc != null) {
				collections.SunArchives.findOne({ "file": Arc._id }, function (err, ArcIdx) {
					//console.log(ArcIdx);
					if (ArcIdx != null) {
						res.render('gererindex',{usrSession:req.UserSession.type,arcDoc: Arc, arcIdx: ArcIdx.index });
					} else {
						res.render('gererindex', {usrSession:req.UserSession.type,arcDoc: Arc});
					};
				});
		};
	});
};

exports.getArc = function(req, res, next){
	var collections = req.collections;
	var gfs = req.gfs;
    var idArc = req.params.id;
	if (!idArc) return next(new Error('ID Archive Manquant.'));
	collections.archivesFiles.findOne({"_id": new ObjectId(idArc)},function(err, Arc) {
		if (Arc != null ){
			var FichierArc = req.tempPath+'/'+idArc+'.'+Arc.filename.split('.').pop();
			console.log('Serveur => Extraction du fichier : '+FichierArc);
			var fs_write_stream = fs.createWriteStream(FichierArc);
			var readstream = gfs.createReadStream({_id: new ObjectId(idArc)});
			readstream.pipe(fs_write_stream);
			fs_write_stream.on('close', function () {
				console.log(req.sessionID + ' => envoi : ' + FichierArc);
				if ((FichierArc.split('.').pop() != 'pdf') && (FichierArc.split('.').pop() != 'pcl') && (FichierArc.split('.').pop() != 'txt')) {
					res.download(FichierArc,Arc.filename, function (err) {
						if (err) {
							console.log(err);
							res.status(err.status).end();
						}
						else {
							console.log(req.sessionID + ' => envoi : ' + FichierArc+' / Done.');
							//res.end();
							fs.unlink(FichierArc, function (err) {
								if (err) {
									console.log(err);
								} else {
									console.log('Serveur => Supprime : ' + FichierArc);
								}
							});
						}
					});
				};
				if(FichierArc.split('.').pop() == 'pdf'){
					res.sendFile(FichierArc,function(err){
						if (err) {
							console.log(err);
							res.status(err.status).end();
						}
						else {
							console.log('OK');
							fs.unlink(FichierArc,function(err){
								if(err){
									console.log(err);
								}else {
									console.log(req.clientIpAddress+ ' => Supprime : '+FichierArc);
								}
							});
						}
					});
				};
				if(FichierArc.split('.').pop() == 'pcl'){
					var cmd = 'cmd.exe /C "'+__dirname +'\\viewer\\Viewer.exe '+FichierArc.split('/').join('\\')+' /PDF"';
					console.log(req.clientIpAddress+ ' => Convertion : '+cmd);
					exec(cmd, function(error, stdout, stderr) {
						console.log(stdout);
						console.log(stderr);
						// command output is in stdout
						if (err) {
							console.log(err);
							res.download(FichierArc,function(err){
								if (err) {
										console.log(err);
										res.status(err.status).end();
								}else{
									console.log('OK');
									fs.unlink(FichierArc,function(err){
										if(err){
											console.log(err);
										}else {
											console.log(req.clientIpAddress+ ' => Supprime : '+FichierArc);
										}
									});
								}
							});
						}
						else {
							// del pcl
							fs.unlink(FichierArc,function(err){
								if(err){
									console.log(err);
								}else {
									console.log(req.clientIpAddress+ ' => Supprime : '+FichierArc);
								}
							});
							// envoi pdf
							FichierArc = FichierArc.split('.pcl').join('.pdf');
							console.log(clientIpAddress+ ' => envoi : '+FichierArc);
							res.sendFile(FichierArc,function(err){
								if (err) {
									console.log(err);
									res.status(err.status).end();
								}
								else {
									console.log('OK');
									fs.unlink(FichierArc,function(err){
										if(err){
											console.log(err);
										}else {
											console.log(req.clientIpAddress+ ' => Supprime : '+FichierArc);
										}
									});
								}
							});
						}
					});
				};
				if(FichierArc.split('.').pop() == 'txt'){
					res.sendFile(FichierArc,function(err){
						if (err) {
							console.log(err);
							res.status(err.status).end();
						}
						else {
							console.log('OK');
							fs.unlink(FichierArc,function(err){
								if(err){
									console.log(err);
								}else {
									console.log(req.clientIpAddress+ ' => Supprime : '+FichierArc);
								}
							});
						}
					});
				};
			});
		}else{
			res.sendStatus(404); // equivalent to res.status(404).send('Not Found')
		};
	});
};

