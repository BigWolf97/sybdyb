#!/usr/bin/env node
var debug = require('debug')('OceaneWebApp');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('socket.io')();
var fs = require('fs');
var session = require("express-session");
const MongoStore = require('connect-mongo')(session);

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Grid = require('gridfs-stream');
var Schema = mongoose.Schema; 
Grid.mongo = mongoose.mongo;
//var js2xml = require("js2xml").Js2Xml;

var routes = require('./routes');
var tmpMainPath = __dirname + '/';
var UserSessionId = '';
var url = 'mongodb://user1YA:PCetni3tq46mdXdk@mongodb-sybdyb.7e14.starter-us-west-2.openshiftapps.com/testmongodb';
//http://mongodb-sybdyb.7e14.starter-us-west-2.openshiftapps.com/

var MongoOptions = {
    useMongoClient: true,
    /* other options */
};
mongoose.Promise = global.Promise;
mongoose.connect(url, MongoOptions, function (error) {
    if(error){
        console.log("Impossible de se Connecter au serveur MongoDB car : \n"+error);
        process.exit(1);
    };
    console.log("Connecté au serveur MongoDB");
    var db = mongoose.connection.db;
    var gfs = Grid(db);
    //***
    // compile db
    var collections = require('./routes/mongoDbSchema')(mongoose);
    
    //***
    var app = express();
    var SocketIoInstance = require('./routes/socketIo');
    SocketIoInstance.start(io,collections,gfs);
    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');

    //app.use(favicon(__dirname + '/public/favicon.ico'));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(require('stylus').middleware(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(session({
        resave: false, 
        saveUninitialized: true, 
        secret: 'XSOMERANDOMSECRETHEREX', 
        cookie: { maxAge: 15 * 60 * 1000 },
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    }));
    //--
    app.use(function (req, res, next) {
        req.collections = collections;
        req.gfs = gfs;
        req.tempPath = path.join(__dirname, 'temp');
        var originalUrl = req.originalUrl;
        //UserSessionId = req.sessionID;
        //--
        
        //var pathname = url.parse(request.url).pathname;
        //var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        //console.log(fullUrl);
        
        if (req.sessionID){
            //console.log('--------------- => Session non vide');
            collections.Session.findOne({ "_id": req.sessionID,state : 'on' }, function (err, UserSession) {
                if (UserSession){
                    //console.log('--------------- => Session Active');
                    req.UserSession = UserSession;
                    
                    req.session.touch();
                    //console.log(UserSession.type+' => '+req.originalUrl);
                    if(originalUrl == '/logout'){
                        return next();
                    };
                    if(UserSession.type == 'admin'){
                        //console.log('Type Admin');
                        return next();
                    };
                    if(UserSession.type == originalUrl.split('/')[1]){
                        //console.log('Type Divers');
                        return next();
                    };
                    if(originalUrl== '/oceane'){
                        console.log(originalUrl);
                        return next();
                    };
                    var err = {
                        message:'Contenu non Authorise',
                        usrSession:req.UserSession.type,
                        error: {
                            status : '',
                            stack : 'Contenu non Authorise'
                        }
                    };
                    res.render('error', err);
                    //return next();
                }else{
                    if(originalUrl== '/oceane'){
                        //console.log(originalUrl);
                        return next();
                    };
                    res.render('indexAlt',{ SessId: req.sessionID,originalUrl: originalUrl});//res.redirect('/');
                }
            })
        }else{
            //console.log('--------------- => Session Vide');
            if(originalUrl== '/oceane'){
                //console.log(originalUrl);
                return next();
            };
            //res.redirect('/');req.originalUrl
            res.render('indexAlt',{ originalUrl: originalUrl});
        } 
        //return next();
    });

    // Pages and routes
    app.get('/', routes.oceane.show);
    //app.get('/login', routes.index);
    app.get('/archives/', routes.archive.show);
    app.get('/temps/', routes.temps.show);
    app.get('/config/', routes.config.show);
    app.get('/contact/', routes.contact.show);
    app.get('/contact/new/', routes.contact.new);
    app.get('/archives/add/', routes.archive.add);
    app.get('/archives/conf/', routes.archive.config);
    app.get('/archives/:id', routes.archive.getArc);
    app.get('/archives/add/:id', routes.archive.addidx);
    app.get('/iadb', routes.iadb.show);
    app.get('/oceane', routes.oceane.show);
    app.get('/market', routes.market.hall);
    app.get('/market/:id', routes.market.shop);
    app.get('/logout', function (req, res, next) {
        req.session.destroy();
        res.redirect('/');
    });
    //app.get('/iadb', routes.index);


    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }
    // production error handler
    // no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });

    app.set('port', process.env.PORT || 80);
    var server = app.listen(app.get('port'), function() {
        var addr = server.address();
        console.log('Serveur Lancé sur : ' + addr.address + ':' + addr.port);
        io.listen(server);
    });
});

