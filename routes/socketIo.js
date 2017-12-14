var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');
var fs = require('fs');
var exec = require('child_process').exec;
var dl = require('delivery');
var iaBrain = require('./iaBrain.js')
//var moment = require('moment');

const uuidv4 = require('uuid/v4');
module.exports = {
    start: function(io,collections,gfs) {
        io.on('connection', function (socket) {
            var clientIpAddress = socket.conn.remoteAddress;
            var hostServer = socket.handshake.referer;
            console.log(clientIpAddress + ' | Client connecté ');
            socket.on('messageIN', function (data) {
                var diag = false;
                if (data["message"] != null) {
                    var msg = data["message"];
                    if (msg.type == 'Session') {
                        if (msg.action == 'connect') {
                            console.log(clientIpAddress + ' | Session => connect');
                            var askConn = msg.data;
                            //console.log(askConn);
                            if (!askConn.passw){
                                askConn.passw ='';
                            }
                            collections.Utilisateur.findOne({ "nom": askConn.user,"Password": askConn.passw }, function (err, user) {
                                //console.log(user);
                                if (user != null) {
                                    // tester le mot de passse
                                    // verifier si deja connecté
                                    collections.Session.findOne({_id:askConn.UserSessionId}, function (err, usrSession) {
                                        if (usrSession){
                                            usrSession.userid = user._id.toString();
                                            usrSession.userName = user.nom;
                                            //SessionL.sessId = req.sessionID;
                                            usrSession.uuid = askConn.UserSessionId;//uuidv4();
                                            usrSession.timestamp = Date.now();
                                            usrSession.type = user.Droits;
                                            usrSession.state = 'on';
                                            usrSession.address = socket.handshake.address;
                                            usrSession.save(function (errr) {
                                                if (errr == null){
                                                    //console.log(usrSession);user.baseUrl
                                                    delete usrSession.userid;
                                                    delete usrSession.timestamp;
                                                    delete usrSession.type;
                                                    delete usrSession.state;
                                                    delete usrSession.address;
                                                    delete usrSession._id;
                                                    var originalUrl = '/iadb';
                                                    if (askConn.originalUrl){
                                                        if (askConn.originalUrl != '/'){
                                                            originalUrl = askConn.originalUrl;
                                                        }else{
                                                            if (user.Droits && user.Droits != 'admin'){
                                                                originalUrl = '/'+user.Droits;
                                                            }else{
        
                                                                originalUrl = '/iadb';
                                                            }
                                                        }
                                                    }
                                                    
                                                    console.log(usrSession.uuid+' => '+ usrSession.userName + ', '+originalUrl);
                                                    socket.emit("messageOUT", { message: { 'type': 'Session', 'option': 'connect', 'data': usrSession , 'baseUrl': originalUrl } });
                                                }
                                            });
                                            //console.log(err);
                                            // update le user pour la derniere session enregistrée
                                            // reponse  
                                        }
                                                                                     
                                    });  
                                };
                            });
                            //-- Brodcast question
                            //socket.emit("messageOUT", { message: { 'type': 'Session', 'option': 'connect', 'data': {user:askIn.user,texte:askIn.texte}} });
                            //socket.broadcast.emit("messageOUT", { message: { 'type': 'iaTchat', 'option': 'Write', 'data': {user:askIn.user,texte:askIn.texte}} });
                            //-- Log Question
                            //askIn.ipAdress = clientIpAddress;
                            //console.log(iaBrain.Log(askIn));
                            //iaBrain.Log(askIn);
                            //-- analyse

                            //-- Brodcast Reponse


                        };
                    }else{
                        if(msg.data && msg.data.UserSession){
                            var uSession = msg.data.UserSession;
                            delete msg.data['UserSession'];
                            //console.log(uSession);
                            collections.Session.findOne({ "_id": uSession.uuid,state : 'on'}, function (err, usrSession) {
                                if (usrSession){
                                    // touch session expires
                                    var expDate = usrSession.expires;
                                    usrSession.expires = expDate.setMinutes(expDate.getMinutes()+10);;
                                    //usrSession.expires = moment(usrSession.expires).add(10, 'm');
                                    usrSession.save();
                                    // iaTchat
                                    if (msg.type == 'iaTchat') {
                                        if (msg.action == 'init') {
                                            console.log(uSession.uuid+'/'+uSession.userName + ' | iaTchat => init');
                                            //var askIn = msg.data;
                                            collections.iaTchatLog.find().sort({date:-1}).limit(20).exec(function (err,iaTchat) {
                                                if (iaTchat != null) {
                                                    //console.log(docs);
                                                    socket.emit("messageOUT", { message: { 'type': 'iaTchat', 'option': 'listLast', 'data': iaTchat } });
                                                }
                                            });

                                        };
                                        if (msg.action == 'ask') {
                                            console.log(uSession.uuid+'/'+uSession.userName + ' | iaTchat => Ask');
                                            var askIn = msg.data;
                                            
                                            askIn.user = uSession.userName;
                                            //-- Brodcast question
                                            socket.emit("messageOUT", { message: { 'type': 'iaTchat', 'option': 'Write', 'data': askIn} });
                                            socket.broadcast.emit("messageOUT", { message: { 'type': 'iaTchat', 'option': 'Write', 'data': askIn} });
                                            //-- Log Question
                                            askIn.ipAdress = clientIpAddress;
                                            //console.log(iaBrain.Log(askIn));
                                            iaBrain.Log(collections,askIn);
                                            //-- analyse

                                            //-- Brodcast Reponse


                                        };
                                    };
                                    //Contact
                                    if (msg.type == 'Contact') {
                                        if (msg.action == 'list') {
                                            console.log(uSession.uuid+'/'+uSession.userName + ' | Contact => Liste');
                                            var ctc = msg.data;
                                            var id = {};
                                            if (ctc.IDAgence) {
                                                id["IDAgence"] = ctc.IDAgence;
                                            };
                                            if (ctc.Nom) {
                                                id["Nom"] = ctc.Nom;
                                            };
                                            if (ctc.CodePostale) {
                                                id["CodePostale"] = ctc.CodePostale;
                                            };

                                            var page = ctc.page;
                                            //console.log(ctc);
                                            //console.log(id);
                                            collections.Contact.find(id).sort({ Nom: 1 }).skip(page * 5).limit(5).exec(function (err, ContactL) {
                                                if (ContactL != null) {
                                                    //console.log(ContactL);
                                                    socket.emit("messageOUT", { message: { 'type': 'Contact', 'option': 'list', 'data': ContactL } });                   
                                                };
                                            });
                                        };
                                        if (msg.action == 'get') {
                                            console.log(uSession.uuid+'/'+uSession.userName + ' | Contact => get');
                                            var ctc = msg.data;

                                            collections.Contact.findOne({ "_id": ObjectId(ctc._id) }, function (err, Contact) {
                                                if (Contact != null) {
                                                    socket.emit("messageOUT", { message: { 'type': 'Contact', 'option': 'getOk', 'data': Contact } });
                                                };
                                                //console.log(TempsList);

                                            });
                                        };
                                        if (msg.action == 'add') {
                                            console.log(uSession.uuid+'/'+uSession.userName + ' | Contact => add');
                                            var parms = msg.data;
                                            //console.log(parms);
                                            var tmpId = parms._id;
                                            delete parms['_id'];
                                            var page = 0;
                                            if (tmpId) {
                                                collections.Contact.findOne({ '_id': ObjectId(tmpId) }, function (err, result) {
                                                    if (result) {
                                                        console.log(uSession.uuid+'/'+uSession.userName + ' | aaaa => Contact Mise a jour OK');
                                                        Object.keys(parms).forEach(function(key) { result[key] = parms[key]; });
                                                        result.save(function (err) {
                                                            socket.emit("messageOUT", { message: { 'type': 'Contact', 'option': 'addOK', 'data': { '_id': tmpId } } });
                                                            var id = {};
                                                            id["IDAgence"] = parms.IDAgence;
                                                            id["Nom"] = parms.Nom;
                                                            id["CodePostale"] = parms.CodePostale;
    
                                                            collections.Contact.find(id,function (err, Contact) {
                                                                assert.equal(err, null);
                                                                if (Contact != null) {
                                                                    socket.emit("messageOUT", { message: { 'type': 'Contact', 'option': 'list', 'data': Contact } });                   
                                                                };
                                                            });
                                                        });
                                                    }
                                                });
                                            } else {
                                                new collections.Contact(parms).save(function (err, result) {
                                                        console.log(uSession.uuid+'/'+uSession.userName  + ' | aaaa => Contact Creer OK');
                                                        //console.log(err);
                                                        socket.emit("messageOUT", { message: { 'type': 'Contact', 'option': 'addOK', 'data': { '_id': result._id.toString() } } });
                                                        var id = {};
                                                        id["IDAgence"] = parms.IDAgence;
                                                        id["Nom"] = parms.Nom;
                                                        id["CodePostale"] = parms.CodePostale;
                                                        collections.Contact.find(id).sort({ Nom: 1 }).skip(page * 5).limit(5).exec(function (err, Contact) {
                                                            assert.equal(err, null);
                                                            if (Contact != null) {
                                                                socket.emit("messageOUT", { message: { 'type': 'Contact', 'option': 'list', 'data': Contact } });                   
                                                            };
                                                        });
                                                    }
                                                );
                                            };

                                        };
                                    };
                                    //Temps
                                    if (msg.type == 'Temps') {
                                        if (msg.action == 'list') {
                                            
                                            var usr = msg.data;//.findOne({"_id": ObjectId(usr._id)}
                                            var id = {};
                                            if (usr.IDUser) {
                                                id["IDUtilisateur"] = usr.IDUser;
                                            };
                                            if (usr.IDTache) {
                                                id["IDTache"] = usr.IDTache;
                                            };
                                            if (usr.IDProjet) {
                                                id["IDProjet"] = usr.IDProjet;
                                            };
                                            if (usr.IDClient) {
                                                id["IDClient"] = usr.IDClient;
                                            };
                                            var page = usr.page;
                                            var TempsList = [];
                                            //console.log(id);
                                            var streamTemps = collections.Temps.find(id).sort({ DateDebut: -1 }).skip(page * 5).limit(5).stream();
                                            streamTemps.on('data', Temps => { 
                                                //console.log(Temps);
                                                assert.equal(err, null);
                                                if (Temps != null) {
                                                    collections.Tache.findOne({ "_id": ObjectId(Temps.IDTache) }, function (err, Tache) {
                                                        if (Tache != null) {
                                                            collections.Client.findOne({ "_id": ObjectId(Temps.IDClient) }, function (err, Client) {
                                                                if (Client != null) {
                                                                    collections.Projet.findOne({ "_id": ObjectId(Temps.IDProjet) }, function (err, Projet) {
                                                                        if (Projet != null) {
                                                                            var unTemps = {};
                                                                            unTemps["_id"] = Temps._id;
                                                                            unTemps["IDUtilisateur"] = Temps.IDUtilisateur;
                                                                            unTemps["IDTache"] = Temps.IDTache;
                                                                            unTemps["Tache"] = Tache.Nom;
                                                                            unTemps["Commentaire"] = Temps.Commentaire;
                                                                            unTemps["IDClient"] = Temps.IDClient;
                                                                            unTemps["Client"] = Client.Nom;
                                                                            unTemps["IDProjet"] = Temps.IDProjet;
                                                                            unTemps["Projet"] = Projet.Nom;
                                                                            unTemps["DateDebut"] = Temps.DateDebut;
                                                                            unTemps["HeureDebut"] = Temps.HeureDebut;
                                                                            unTemps["HeureFin"] = Temps.HeureFin;
                                                                            //TempsList.push(unTemps);
                                                                            //console.log(unTemps);
                                                                            console.log(uSession.uuid+'/'+uSession.userName  + ' | Temps => Liste');
                                                                            socket.emit("messageOUT", { message: { 'type': 'Temps', 'option': 'list', 'data': unTemps } });
                                                                        };
                                                                    });
                                                                };
                                                            });
                                                        };
                                                    });  
                                                };
                                            });
                                        };
                                        if (msg.action == 'get') {
                                            console.log(uSession.uuid+'/'+uSession.userName  + ' | Temps => get');
                                            var usr = msg.data;

                                            collections.Temps.findOne({ "_id": ObjectId(usr._id) }, function (err, Temps) {
                                                if (Temps != null) {
                                                    socket.emit("messageOUT", { message: { 'type': 'Temps', 'option': 'getOk', 'data': Temps } });
                                                };
                                                //console.log(TempsList);

                                            });
                                        };
                                        if (msg.action == 'add') {
                                            //console.log(uSession.uuid+'/'+uSession.userName  + ' | Temps => add');
                                            var parms = msg.data;
                                            //console.log(parms);
                                            var tmpId = parms._id;
                                            delete parms['_id'];
                                            var page = 0;
                                            if (tmpId) {
                                                collections.Temps.findOne({ '_id': ObjectId(tmpId) },function (err, result) {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                    if (result) {
                                                        Object.keys(parms).forEach(function(key) { result[key] = parms[key]; });
                                                        result.save(function (err) {
                                                            console.log(uSession.uuid+'/'+uSession.userName  + ' | Temps =>  Mise a jour OK');
                                                            socket.emit("messageOUT", { message: { 'type': 'Temps', 'option': 'addOK', 'data': { '_id': result._id } } });
                                                            var id = {};
                                                            id["IDUtilisateur"] = parms.IDUtilisateur;
                                                            id["IDTache"] = parms.IDTache;
                                                            collections.Temps.find(id).sort({ DateDebut: -1 }).skip(page * 5).limit(5).exec(function (err, Temps) {
                                                                assert.equal(err, null);
                                                                if (Temps != null) {
                                                                    collections.Tache.findOne({ "_id": ObjectId(Temps.IDTache) }, function (err, Tache) {
                                                                        if (Tache != null) {
                                                                            collections.Client.findOne({ "_id": ObjectId(Temps.IDClient) }, function (err, Client) {
                                                                                if (Client != null) {
                                                                                    collections.Projet.findOne({ "_id": ObjectId(Temps.IDProjet) }, function (err, Projet) {
                                                                                        if (Projet != null) {
                                                                                            var unTemps = {};
                                                                                            unTemps["_id"] = Temps._id;
                                                                                            unTemps["IDTache"] = Temps.IDTache;
                                                                                            unTemps["Tache"] = Tache.Nom;
                                                                                            unTemps["Commentaire"] = Temps.Commentaire;
                                                                                            unTemps["IDClient"] = Temps.IDClient;
                                                                                            unTemps["Client"] = Client.Nom;
                                                                                            unTemps["IDProjet"] = Temps.IDProjet;
                                                                                            unTemps["Projet"] = Projet.Nom;
                                                                                            unTemps["DateDebut"] = Temps.DateDebut;
                                                                                            unTemps["HeureDebut"] = Temps.HeureDebut;
                                                                                            unTemps["HeureFin"] = Temps.HeureFin;
                                                                                            //TempsList.push(unTemps);
                                                                                            //console.log(unTemps);
                                                                                            socket.emit("messageOUT", { message: { 'type': 'Temps', 'option': 'list', 'data':  unTemps } });
                                                                                        };
                                                                                    });
                                                                                };
                                                                            });
                                                                        };
                                                                    });
                                                                };
                                                            });
                                                        });
                                                        
                                                    }
                                                });
                                            } else {
                                                new collections.Temps(parms).save(function (err, result) {
                                                    console.log(uSession.uuid+'/'+uSession.userName  + ' | Temps =>  Creer OK');
                                                    //console.log(err);
                                                    socket.emit("messageOUT", { message: { 'type': 'Temps', 'option': 'addOK', 'data': { '_id': result._id } } });
                                                    var id = {};
                                                    id["IDUtilisateur"] = parms.IDUtilisateur;
                                                    id["IDTache"] = parms.IDTache;
                                                    collections.Temps.find(id).sort({ DateDebut: -1 }).skip(page * 5).limit(5).exec(function (err, Temps) {
                                                        assert.equal(err, null);
                                                        if (Temps != null) {
                                                            collections.Tache.findOne({ "_id": ObjectId(Temps.IDTache) }, function (err, Tache) {
                                                                if (Tache != null) {
                                                                    collections.Client.findOne({ "_id": ObjectId(Temps.IDClient) }, function (err, Client) {
                                                                        if (Client != null) {
                                                                            collections.Projet.findOne({ "_id": ObjectId(Temps.IDProjet) }, function (err, Projet) {
                                                                                if (Projet != null) {
                                                                                    var unTemps = {};
                                                                                    unTemps["_id"] = Temps._id;
                                                                                    unTemps["IDTache"] = Temps.IDTache;
                                                                                    unTemps["Tache"] = Tache.Nom;
                                                                                    unTemps["Commentaire"] = Temps.Commentaire;
                                                                                    unTemps["IDClient"] = Temps.IDClient;
                                                                                    unTemps["Client"] = Client.Nom;
                                                                                    unTemps["IDProjet"] = Temps.IDProjet;
                                                                                    unTemps["Projet"] = Projet.Nom;
                                                                                    unTemps["DateDebut"] = Temps.DateDebut;
                                                                                    unTemps["HeureDebut"] = Temps.HeureDebut;
                                                                                    unTemps["HeureFin"] = Temps.HeureFin;
                                                                                    //TempsList.push(unTemps);
                                                                                    //console.log(unTemps);
                                                                                    socket.emit("messageOUT", { message: { 'type': 'Temps', 'option': 'list', 'data': unTemps } });
                                                                                };
                                                                            });
                                                                        };
                                                                    });
                                                                };
                                                            });
                                                        };
                                                    });
                                                });
                                            };

                                        };
                                    };
                                    //Tache
                                    if (msg.type == 'Tache') {
                                        if (msg.action == 'list') {
                                            console.log(uSession.uuid+'/'+uSession.userName  + ' | Tache => list');
                                            var parms = msg.data;
                                            if (parms.IDClient) {
                                                var id = { 'IDClient': parms.IDClient };
                                            };
                                            if (parms.IDProjet) {
                                                var id = { 'IDProjet': parms.IDProjet };
                                            };
                                            
                                            collections.Tache.find(id,function (err, Tache) {
                                                if (Tache != null) {
                                                    //console.log(Client);
                                                    socket.emit("messageOUT", { message: { 'type': 'Tache', 'option': 'list', 'data': Tache } });
                                                };
                                            });
                                        };
                                        if (msg.action == 'add') {
                                            console.log(uSession.uuid+'/'+uSession.userName  + ' | Tache => add');
                                            var parms = msg.data;
                                            //console.log(parms);
                                            var tmpId = parms._id;
                                            delete parms['_id'];
                                            if (tmpId) {
                                                collections.Tache.findOne({ '_id': ObjectId(tmpId) }, function (err, result) {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                    if (result) {
                                                        Object.keys(parms).forEach(function(key) { result[key] = parms[key]; });
                                                        console.log(uSession.uuid+'/'+uSession.userName  + ' | Tache =>  Mise a jour OK');
                                                        //console.log(result);
                                                        result.save(function (err, Tache) {
                                                            socket.emit("messageOUT", { message: { 'type': 'Projet', 'option': 'addOK', 'data': { '_id': tmpId } } });
                                                            var id = { 'IDProjet': parms.IDProjet };
                                                            collections.Tache.find(id,function (err, Tache) {
                                                                if (Tache != null) {
                                                                    //console.log(Client);
                                                                    socket.emit("messageOUT", { message: { 'type': 'Tache', 'option': 'list', 'data': Tache } });
                                                                };
                                                            });
                                                        });
                                                    }
                                                });
                                            } else {
                                                new collections.Tache(parms).save(function (err, result) {
                                                    console.log(uSession.uuid+'/'+uSession.userName  + ' | Tache =>  Creer OK');
                                                    //console.log(result);
                                                    socket.emit("messageOUT", { message: { 'type': 'Tache', 'option': 'addOK', 'data': { '_id': result._id } } });
                                                    var id = { 'IDProjet': parms.IDProjet };
                                                    collections.Tache.find(id,function (err, Tache) {
                                                        if (Tache != null) {
                                                            //console.log(Client);
                                                            socket.emit("messageOUT", { message: { 'type': 'Tache', 'option': 'list', 'data': Tache } });
                                                        };
                                                    });
                                                });
                                            };

                                        };
                                    };
                                    //Projet
                                    if (msg.type == 'Projet') {
                                        if (msg.action == 'list') {
                                            console.log(uSession.uuid+'/'+uSession.userName  + ' | Projet => list');
                                            var parms = msg.data;
                                            var id = { 'IDClient': parms.IDClient };
                                            collections.Projet.find(id,function (err, Projet) {
                                                if (Projet != null) {
                                                    //console.log(Client);
                                                    socket.emit("messageOUT", { message: { 'type': 'Projet', 'option': 'list', 'data': Projet } });
                                                };
                                            });
                                        };
                                        if (msg.action == 'add') {
                                            console.log(uSession.uuid+'/'+uSession.userName  + ' | Projet => add');
                                            var parms = msg.data;
                                            //console.log(parms);
                                            var tmpId = parms._id;
                                            delete parms['_id'];
                                            if (tmpId) {
                                                collections.Projet.findOne(
                                                    { '_id': ObjectId(tmpId) }, // query
                                                    function (err, result) {
                                                        if (err) {
                                                            console.log(err);
                                                        }
                                                        if (result) {
                                                            Object.keys(parms).forEach(function(key) { result[key] = parms[key]; });
                                                            console.log(uSession.uuid+'/'+uSession.userName  + ' | aaaa => Projet Mise a jour OK');
                                                            //console.log(result);
                                                            result.save(function (err) {
                                                                socket.emit("messageOUT", { message: { 'type': 'Projet', 'option': 'addOK', 'data': { '_id': tmpId } } });
                                                                var id = { 'IDClient': parms.IDClient };
                                                                collections.Projet.find(id,function (err, Projet) {
                                                                    if (Projet != null) {
                                                                        //console.log(Client);
                                                                        socket.emit("messageOUT", { message: { 'type': 'Projet', 'option': 'list', 'data': Projet } });
                                                                    };
                                                                });
                                                            }); 
                                                        }
                                                    }
                                                );
                                            } else {
                                                new collections.Projet.insertOne(parms).save(function (err, result) {
                                                    console.log(uSession.uuid+'/'+uSession.userName  + ' | Projet =>  Creer OK');
                                                    //console.log(result);
                                                    socket.emit("messageOUT", { message: { 'type': 'Projet', 'option': 'addOK', 'data': { '_id': result._id } } });
                                                    var id = { 'IDClient': parms.IDClient };
                                                    collections.Projet.find(id,function (err, Projet) {
                                                        if (Projet != null) {
                                                            //console.log(Client);
                                                            socket.emit("messageOUT", { message: { 'type': 'Projet', 'option': 'list', 'data': Projet } });
                                                        };
                                                    });
                                                });
                                            };

                                        };
                                    };
                                    //Client
                                    if (msg.type == 'Client') {
                                        if (msg.action == 'list') {
                                            console.log(uSession.uuid+'/'+uSession.userName  + ' | Client => list');
                                            var parms = msg.data;
                                            collections.Client.find({},function (err, Client) {
                                                if (Client != null) {
                                                    //console.log(Client);
                                                    socket.emit("messageOUT", { message: { 'type': 'Client', 'option': 'list', 'data': Client } });
                                                };
                                            });
                                        };
                                        if (msg.action == 'get') {
                                            console.log(uSession.uuid+'/'+uSession.userName  + ' | Client => get');
                                            var parms = msg.data;
                                            var id = { '_id': parms.IDClient };
                                            collections.Client.findOne(id, function (err, Client) {
                                                if (Client != null) {
                                                    //console.log(Client);
                                                    socket.emit("messageOUT", { message: { 'type': 'Client', 'option': 'getOk', 'data': Client } });
                                                };
                                            });
                                        };
                                        if (msg.action == 'add') {
                                            //console.log(uSession.uuid+'/'+uSession.userName  + ' | Client => add');
                                            var parms = msg.data;
                                            //console.log(parms);
                                            var tmpId = parms._id;
                                            delete parms['_id'];
                                            if (tmpId) {
                                                collections.Client.findOne(
                                                    { '_id': ObjectId(tmpId) }, // query
                                                    function (err, result) {
                                                        if (err) {
                                                            console.log(err);
                                                        }
                                                        if (result) {
                                                            console.log(uSession.uuid+'/'+uSession.userName  + ' | Client => Mise a jour OK');
                                                            //console.log(result);
                                                            Object.keys(parms).forEach(function(key) { result[key] = parms[key]; });
                                                            result.save(function (err, Client) {
                                                                socket.emit("messageOUT", { message: { 'type': 'Client', 'option': 'addOK', 'data': { '_id': tmpId } } });
                                                            });
                                                            
                                                        }
                                                    }
                                                );
                                            } else {
                                                new collections.Client(parms).save(function (err, result) {
                                                    console.log(uSession.uuid+'/'+uSession.userName  + ' | Client => Creer OK');
                                                    //console.log(result);
                                                    socket.emit("messageOUT", { message: { 'type': 'Client', 'option': 'addOK', 'data': { '_id': result._id }} });
                                                });
                                            };

                                        };
                                    };
                                    //Todo
                                    if (msg.type == 'TodoApp') {
                                        console.log(uSession.uuid+'/'+uSession.userName  + ' | aaaa => TodoApp');
                                        if (msg.action == 'list') {
                                            console.log(uSession.uuid+'/'+uSession.userName  + ' | aaaa => list');
                                            var parms = msg.data;
                                            //console.log(parms);
                                            if (parms.userid) {
                                                var rqs = { 'state': '1', 'userid': parms.userid };
                                            } else {
                                                var rqs = { 'state': '1' };
                                            };

                                            collections.Todo.find(rqs).toArray(function (err, docs) {
                                                assert.equal(err, null);
                                                //console.log(docs);
                                                socket.emit("messageOUT", { message: { 'type': 'TodoApp', 'option': 'list', 'data': docs } });
                                            });
                                        };
                                        if (msg.action == 'get') {
                                            console.log(uSession.uuid+'/'+uSession.userName  + ' | aaaa => get');
                                            var parms = msg.data;
                                            //console.log(parms);
                                            collections.Todo.findOne({ '_id': ObjectId(parms._id) },function (err, docs) {
                                                assert.equal(err, null);
                                                //console.log(docs);
                                                socket.emit("messageOUT", { message: { 'type': 'TodoApp', 'option': 'getOk', 'data': docs } });
                                            });
                                        };
                                        if (msg.action == 'end') {
                                            console.log(uSession.uuid+'/'+uSession.userName  + ' | aaaa => end');
                                            var parms = msg.data;
                                            //console.log(parms);
                                            collections.Todo.update(
                                                { '_id': ObjectId(parms._id) }, // query
                                                { $set: {'state':'0'} },
                                                function (err, result) {
                                                    if (err) {
                                                        console.log('Erreur');
                                                        console.log(err);
                                                    }
                                                    if (result) {
                                                        console.log(uSession.uuid+'/'+uSession.userName  + ' | aaaa => Tache terminee OK');
                                                        if (parms.userid) {
                                                            var rqs = { 'state': '1', 'userid': parms.userid };
                                                        } else {
                                                            var rqs = { 'state': '1'};
                                                        };

                                                        collections.Todo.find(rqs).toArray(function (err, docs) {
                                                            assert.equal(err, null);
                                                            //console.log(docs);
                                                            socket.emit("messageOUT", { message: { 'type': 'TodoApp', 'option': 'list', 'data': docs } });
                                                        });
                                                    }
                                                }
                                            );
                                        };
                                        if (msg.action == 'add') {
                                            console.log(uSession.uuid+'/'+uSession.userName  + ' | aaaa => add');
                                            var parms = msg.data;
                                            //console.log(parms);
                                            var tmpId = parms._id;
                                            delete parms['_id'];
                                            if (tmpId) {
                                                collections.Todo.update(
                                                    { '_id': ObjectId(tmpId) }, // query
                                                    { $set: parms },
                                                    function (err, result) {
                                                        if (err) {
                                                            console.log('Erreur');
                                                            console.log(err);
                                                        }
                                                        if (result) {
                                                            console.log(uSession.uuid+'/'+uSession.userName  + ' | aaaa => Tache Mise a jour OK');
                                                            //console.log(result);
                                                            socket.emit("messageOUT", { message: { 'type': 'TodoApp', 'option': 'addOK', 'data': { '_id': tmpId } } });
                                                            collections.Todo.find({ 'state': '1', 'userid': parms.userid }).toArray(function (err, docs) {
                                                                assert.equal(err, null);
                                                                //console.log(docs);
                                                                socket.emit("messageOUT", { message: { 'type': 'TodoApp', 'option': 'list', 'data': docs } });
                                                            });
                                                        }
                                                    }
                                                );
                                            } else {
                                                collections.Todo.insertOne(parms,
                                                    { w: 1 },
                                                    function (err, result) {
                                                        console.log(uSession.uuid+'/'+uSession.userName  + ' | aaaa => Tache Creer OK');
                                                        //console.log(result);
                                                        socket.emit("messageOUT", { message: { 'type': 'TodoApp', 'option': 'addOK', 'data': result.insertedId } });
                                                        collections.Todo.find({ 'state': '1', 'userid': parms.userid }).toArray(function (err, docs) {
                                                            assert.equal(err, null);
                                                            //console.log(docs);
                                                            socket.emit("messageOUT", { message: { 'type': 'TodoApp', 'option': 'list', 'data': docs } });
                                                        });
                                                    }
                                                );
                                            };
                                            
                                        };
                                    };
                                    //ArchiveDoc
                                    if (msg.type == 'ArchiveDoc') {
                                        if (msg.action == 'ArcIdxSave') {
                                            //console.log(uSession.uuid+'/'+uSession.userName  + ' | ArchiveDoc => ArcIdxSave');
                                            var parms = msg.data;
                                            var ArcIdx = {};
                                            var rqsOk = false;
                                            
                                            if (parms.ArcDocID && parms.ArcDocIdx) {
                                                parms.ArcDocIdx.forEach(function (idx) {
                                                    if (idx.IndexName != '' && idx.IndexVal != '') {
                                                        ArcIdx[idx.IndexName] = idx.IndexVal;
                                                        rqsOk = true;
                                                    }
                                                });
                                            }
                                            if (rqsOk) {
                                                //delete rqs['_id'];
                                                collections.SunArchives.findOne({ 'file': parms.ArcDocID },function (err, ArcDoc) {
                                                    if(ArcDoc){
                                                        Object.keys(ArcIdx).forEach(function(key) { ArcDoc.index[key] = ArcIdx[key]; });
                                                        ArcDoc.markModified('index');
                                                        ArcDoc.save(function (err) {
                                                            if (err) {
                                                                console.log(err);
                                                            }else{
                                                                //console.log(ArcDoc);
                                                                console.log(uSession.uuid+'/'+uSession.userName  + ' | ArchiveDoc => Maj Indexes de l\'Archive OK');
                                                                socket.emit("messageOUT", { message: { 'type': 'ArchiveDoc', 'option': 'ArcIdxSaveOK', 'data': ArcDoc } });
                                                            }
                                                        });
                                                    }else{
                                                        var ArcAtt = {};
                                                        ArcAtt['file'] = parms.ArcDocID;
                                                        ArcAtt['ARCDOC'] = parms.ArcDocFName;
                                                        ArcAtt.index = ArcIdx;
                                                        ArcDoc = new collections.SunArchives(ArcAtt);
                                                        ArcDoc.save(function (err) {
                                                            if (err) {
                                                                console.log(err);
                                                            }else{
                                                                //console.log(result);
                                                                console.log(uSession.uuid+'/'+uSession.userName  + ' | ArchiveDoc => Indexation de l\'Archive OK');
                                                                socket.emit("messageOUT", { message: { 'type': 'ArchiveDoc', 'option': 'ArcIdxSaveOK', 'data': ArcDoc } });
                                                            }
                                                        });
                                                    };
                                                })
                                            }
                                        };
                                        if (msg.action == 'GererIdx') {
                                            var parms = msg.data;
                                            collections.SunArchives.findOne({ 'file': parms.ArcDocID }, function (err, Arc) {
                                                if (Arc != null) {
                                                    //console.log(Arc);
                                                    // suppression des indexes prives
                                                    ////delete Arc['_id'];
                                                    //delete Arc['ARCJNAM'];
                                                    //delete Arc['ARCJUSR'];
                                                    //delete Arc['ARCJNBR'];
                                                    //delete Arc['ARCFNAM'];
                                                    //delete Arc['ARCSTK'];
                                                    //delete Arc['SYSTEM'];
                                                    //delete Arc['ARCDATC'];
                                                    //delete Arc['ARCTIMC'];
                                                    //delete Arc['Type Format'];
                                                    //delete Arc['NbPages'];
                                                    //delete Arc['Type Archive'];
                                                    //delete Arc['Type Extension'];
                                                    //delete Arc['ARCDOC'];
                                                    //delete Arc['Chemin_acces'];
                                                    //delete Arc['file'];
                                                    //delete Arc['ARCPTAR'];
                                                    

                                                    var idxList = [];
                                                    var keys = Object.keys(Arc.index);
                                                    //console.log(keys);
                                                    keys.forEach(function (k) {
                                                        var idxc = {
                                                            'IndexName': k,
                                                            'IndexVal': Arc.index[k]
                                                        };
                                                        idxList.push(idxc);
                                                    });
                                                    //console.log(idxList);
                                                    console.log(uSession.uuid+'/'+uSession.userName  + ' | GererIdx => Indexes Trouve(s) OK');
                                                    socket.emit("messageOUT", { message: { 'type': 'ArchiveDoc', 'option': 'GererIdxOK', 'data': idxList } });
                                                }
                                            });
                                        };
                                    };
                                    //General
                                    if (msg.type == 'General') {
                                        console.log(uSession.uuid+'/'+uSession.userName  + ' | aaaa => General');
                                        if (msg.action == 'init') {
                                            console.log(uSession.uuid+'/'+uSession.userName  + ' | aaaa => Init');
                                            socket.emit("messageOUT", { message: { 'type': 'general', 'option': 'ClientIpAddress', 'data': hostServer } });

                                            var result = collections.Utilisateur.find({}).toArray(function (err, docs) {
                                                assert.equal(err, null);
                                                //console.log(docs);
                                                socket.emit("messageOUT", { message: { 'type': 'Utilisateur', 'option': 'list', 'data': docs } });
                                            });
                                        };
                                    };

                                    //SuiviPerso
                                    if (msg.type == 'SuiviPerso') {
                                        console.log(uSession.uuid+'/'+uSession.userName  + ' | aaaa => SuiviPerso');
                                        if (msg.action == 'list') {
                                            console.log(uSession.uuid+'/'+uSession.userName  + ' | aaaa => Liste');
                                            var usr = msg.data;//.findOne({"_id": ObjectId(usr._id)}
                                            if (usr.userid) {
                                                var idUser = { "IDUtilisateur": usr.userid };
                                            } else {
                                                var idUser = {};
                                            };
                                            
                                            var tagTachesList = [];
                                            var page = usr.page; 
                                            console.log(usr);
                                            collections.SuiviPerso.find(idUser).sort({ DatCrt: -1 }).skip(page * 5).limit(5).each(function (err, SuiviTache) {
                                                if (SuiviTache != null) {
                                                    collections.Tache.findOne({ "_id": ObjectId(SuiviTache.IDTache) }, function (err, Tache) {
                                                        if (Tache != null) {
                                                            collections.Client.findOne({ "_id": ObjectId(Tache.IDClient) }, function (err, Client) {
                                                                if (Client != null) {
                                                                    collections.Projet.findOne({ "_id": ObjectId(Tache.IDProjet) }, function (err, Projet) {
                                                                        if (Projet != null) {
                                                                            var tagTaches = {};
                                                                            tagTaches["_id"] = Tache._id;
                                                                            tagTaches["Nom"] = Tache.Nom;
                                                                            tagTaches["Etat"] = Tache.Etat;
                                                                            tagTaches["IDClient"] = Tache.IDClient;
                                                                            tagTaches["Client"] = Client.Nom;
                                                                            tagTaches["IDProjet"] = Tache.IDProjet;
                                                                            tagTaches["Projet"] = Projet.Nom;
                                                                            tagTaches["Detail"] = Tache.Detail;
                                                                            //tagTachesList.push(tagTaches);
                                                                            //console.log(tagTaches);
                                                                            socket.emit("messageOUT", { message: { 'type': 'SuiviPerso', 'option': 'list', 'data': tagTaches } });
                                                                        };
                                                                    });
                                                                };
                                                            });
                                                        };
                                                    });
                                                };
                                            });
                                        };
                                        if (msg.action == 'get') {
                                            console.log(uSession.uuid+'/'+uSession.userName  + ' | aaaa => get');
                                            var tache = msg.data;//.findOne({"_id": ObjectId(usr._id)}
                                            if (tache._id) {
                                                var idTache = { "_id": ObjectId(tache._id) };
                                            } else {
                                                var idTache = {};
                                            };
                                            //collections.Tache.findOne(idTache , function (err, Tache) {
                                            //    if (Tache != null) {
                                                    collections.Client.find({}).toArray( function (err, Client) {
                                                        if (Client != null) {
                                                            socket.emit("messageOUT", { message: { 'type': 'SuiviPerso', 'option': 'list', 'data': tagTaches } });
                                                        };
                                                    });
                                                    collections.Projet.find({}).toArray( function (err, Projet) {
                                                        if (Projet != null) {

                                                        };
                                                    });
                                                    collections.Tache.find({}).toArray( function (err, Tache) {
                                                        if (Tache != null) {

                                                        };
                                                    });
                                            // };
                                        // });

                                            var tagTachesList = [];
                                            var page = usr.page;
                                            console.log(usr);
                                            collections.SuiviPerso.find(idUser).sort({ DatCrt: -1 }).skip(page * 5).limit(5).each(function (err, SuiviTache) {
                                                if (SuiviTache != null) {
                                                    collections.Tache.findOne({ "_id": ObjectId(SuiviTache.IDTache) }, function (err, Tache) {
                                                        if (Tache != null) {
                                                            collections.Client.findOne({ "_id": ObjectId(Tache.IDClient) }, function (err, Client) {
                                                                if (Client != null) {
                                                                    collections.Projet.findOne({ "_id": ObjectId(Tache.IDProjet) }, function (err, Projet) {
                                                                        if (Projet != null) {
                                                                            var tagTaches = {};
                                                                            tagTaches["_id"] = Tache._id;
                                                                            tagTaches["Nom"] = Tache.Nom;
                                                                            tagTaches["Etat"] = Tache.Etat;
                                                                            tagTaches["IDClient"] = Tache.IDClient;
                                                                            tagTaches["Client"] = Client.Nom;
                                                                            tagTaches["IDProjet"] = Tache.IDProjet;
                                                                            tagTaches["Projet"] = Projet.Nom;
                                                                            tagTaches["Detail"] = Tache.Detail;
                                                                            //tagTachesList.push(tagTaches);
                                                                            //console.log(tagTaches);
                                                                            socket.emit("messageOUT", { message: { 'type': 'SuiviPerso', 'option': 'list', 'data': tagTaches } });
                                                                        };
                                                                    });
                                                                };
                                                            });
                                                        };
                                                    });
                                                };
                                            });
                                        };
                                    };

                                    // SunArchives
                                    if (msg.type == 'SunArchives') {
                                        if (msg.action == 'IndexList') {
                                            collections.idxTable.distinct("index", { 'group': 'all' }, function (err, items) {
                                                var itemList = items.sort();
                                                socket.emit("messageOUT", { message: { 'type': 'SunArchives', 'option': 'IndexList', 'data': itemList } });
                                            });
                                        }
                                        if (msg.action == 'search') {
                                            console.log(uSession.uuid+'/'+uSession.userName  + ' | SunArchives => search');
                                            var searchidx = msg.data.seek;
                                            var page = msg.page;
                                            var limit = msg.limit;
                                            var searchResult = [];
                                            var rqs = {};
                                            var rqsOk = false;
                                            var vTemp= ''; 
                                            searchidx.forEach(function (critere) {
                                                if (critere.IndexName != '' && critere.IndexVal != '') {
                                                    vTemp = 'index.'+critere.IndexName;
                                                    rqs[vTemp] = critere.IndexVal;
                                                    rqsOk = true;
                                                }
                                            });
                                            //var rqsArc = {index:rqs};
                                            //console.log(rqsArc);
                                            if (rqsOk) {
                                                collections.SunArchives.find(rqs).sort({ ARCDATC: -1 }).skip(page * limit).limit(limit).exec(function (err,docs) {
                                                    if (docs != null) {
                                                        //console.log(docs);
                                                        socket.emit("messageOUT", { message: { 'type': 'SunArchives', 'option': 'search', 'data': docs } });
                                                    }
                                                });
                                            };
                                        }
                                        if (msg.action == 'assist') {
                                            console.log(uSession.uuid+'/'+uSession.userName  + ' | SunArchives => assist');
                                            //console.log(msg);
                                            var searchidx = msg.data;
                                            if (searchidx.index != null) {
                                                var searchResult = [];
                                                var vTemp = '^' + searchidx.valeur;
                                                var vTempIdxName = 'index.' + searchidx.index;
                                                var rqsMatch = { $match: { [vTempIdxName]: { $regex: vTemp, $options: 'i' } } };
                                                var rqsSort = { $sort: { [vTempIdxName]: -1 } };
                                                vTemp = '$' +vTempIdxName;
                                                var rqsGroup = { $group: { _id: vTemp } };
                                                //console.log(rqsMatch);
                                                //console.log(rqsSort);
                                                //console.log(rqsGroup);
                                                collections.SunArchives.aggregate([rqsMatch, rqsSort, rqsGroup, { $limit: 10 }], function (err, arcResult) {
                                                    //console.log(arc)
                                                    if (arcResult) {
                                                        arcResult.forEach(function (arc) {
                                                            if (arc != null) {
                                                                //console.log(arc._id)
                                                                socket.emit("messageOUT", { message: { 'type': 'SunArchives', 'option': 'assist', 'data': arc._id } });
                                                            }
                                                        })
                                                    }
                                                });
                                            }
                                        }
                                        if (msg.action == 'assistSave') {
                                            console.log(uSession.uuid+'/'+uSession.userName  + ' | SunArchives => assist');
                                            //console.log(msg);
                                            var searchidx = msg.data;
                                            if (searchidx.index != null) {
                                                var searchResult = [];
                                                var vTemp = '^' + searchidx.valeur;
                                                //var vTemp = '/^'+searchidx.valeur+'/';var rqsMatch = {$match:{[searchidx.index]:new RegExp(vTemp)}};
                                                var rqsMatch = { $match: { [searchidx.index]: { $regex: vTemp, $options: 'i' } } };
                                                var rqsSort = { $sort: { [searchidx.index]: -1 } };
                                                vTemp = '$' + searchidx.index;
                                                var rqsGroup = { $group: { _id: vTemp } };
                                                //console.log(rqsMatch);
                                                //console.log(rqsSort);
                                                //console.log(rqsGroup);
                                                collections.SunArchives.aggregate([rqsMatch, rqsSort, rqsGroup, { $limit: 10 }], function (err, arcResult) {
                                                    //console.log(arc)
                                                    if (arcResult) {
                                                        arcResult.forEach(function (arc) {
                                                            if (arc != null) {
                                                                //console.log(arc._id)
                                                                socket.emit("messageOUT", { message: { 'type': 'SunArchives', 'option': 'assist', 'data': arc._id } });
                                                            }
                                                        })
                                                    }
                                                });
                                            }
                                        }
                                    }
                                    // IndexTable
                                    if (msg.type == 'IndexTable') {
                                        if (msg.action == 'init') {
                                            console.log(uSession.uuid+'/'+uSession.userName  + ' | IndexTable => Init');
                                            var result = collections.idxTable.find({},function (err, docs) {
                                                assert.equal(err, null);
                                                //console.log(docs);
                                                socket.emit("messageOUT", { message: { 'type': 'IndexTable', 'option': 'list', 'data': docs } });
                                            });
                                            var result = collections.idxTable.distinct("group", function (err, docs) {
                                                assert.equal(err, null);
                                                socket.emit("messageOUT", { message: { 'type': 'IndexTable', 'option': 'indexGroup', 'data': docs } });
                                            });
                                            var result = collections.idxTable.distinct("index", function (err, docs) {
                                                assert.equal(err, null);
                                                socket.emit("messageOUT", { message: { 'type': 'IndexTable', 'option': 'indexNom', 'data': docs } });
                                            });
                                        }
                                        if (msg.action == 'get') {
                                            console.log(uSession.uuid+'/'+uSession.userName  + ' | IndexTable => Get');
                                            var usr = msg.data;
                                            if (usr._id != null) {
                                                var result = collections.idxTable.findOne({ "_id": ObjectId(usr._id) }, function (err, doc) {
                                                    assert.equal(err, null);
                                                    socket.emit("messageOUT", { message: { 'type': 'IndexTable', 'option': 'get', 'data': doc } });
                                                });
                                            };
                                        }
                                        if (msg.action == 'Upt') {
                                            console.log(uSession.uuid+'/'+uSession.userName  + ' | IndexTable => UpdateIdx');
                                            collections.SunArchives.mapReduce(function () { for (var key in this) { emit(key, null); } },
                                                function (key, stuff) { return null; },
                                                { "out": "SunArchives_keys" },
                                                function (er, doc) {
                                                //console.log(er);
                                                //console.log(doc);
                                                collections.SunArchivesKeys.find({}).each(function (err, sKeys) {
                                                    if (sKeys != null) {
                                                        var id = { "index": sKeys._id };
                                                        //console.log(id);
                                                        collections.idxTable.findAndModify(
                                                            id, // query
                                                            { 'index': 1 },  // sort order
                                                            {
                                                                $set: {
                                                                    "index": sKeys._id,
                                                                    "group": ''
                                                                }
                                                            },
                                                            { upsert: true },
                                                            { new: true },
                                                            function (err, object) {
                                                                if (err) {

                                                                } else {
                                                                    console.log(object.value);
                                                                    //socket.emit("messageOUT",{ message: {'type':'IndexTable','option':'create','data':{'_id':object.value._id.toString()}}});
                                                                }
                                                            }
                                                        );
                                                    };
                                                });
                                            });//
                                            
                                        }
                                        if (msg.action == 'list') {
                                            console.log(uSession.uuid+'/'+uSession.userName  + ' | IndexTable => Liste');
                                            var result = collections.idxTable.find({}).toArray(function (err, docs) {
                                                assert.equal(err, null);
                                                //console.log(idxList);
                                                socket.emit("messageOUT", { message: { 'type': 'IndexTable', 'option': 'list', 'data': docs } });
                                            });
                                        }
                                        if (msg.action == 'create') {
                                            var usr = msg.data;
                                            //console.log(usr);
                                            if (usr._id != null) {
                                                console.log(uSession.uuid+'/'+uSession.userName  + ' | IndexTable => Mise a jour');
                                                //console.log(usr);
                                                var id = { "_id": ObjectId(usr._id) };
                                                collections.idxTable.findAndModify(
                                                    id, // query
                                                    { '_id': 'asc' },  // sort order
                                                    {
                                                        $set: {
                                                            "index": usr.index,
                                                            "group": usr.group
                                                        }
                                                    },
                                                    { upsert: true },
                                                    { new: true },
                                                    function (err, object) {
                                                        if (err) {
                                                            console.warn(err.message);  // returns error if no matching object found
                                                        } else {
                                                            socket.emit("messageOUT", { message: { 'type': 'IndexTable', 'option': 'create', 'data': { '_id': object.value._id.toString() } } });
                                                        }
                                                    }
                                                );
                                            } else {
                                                console.log(uSession.uuid+'/'+uSession.userName  + ' | IndexTable => Creation');
                                                collections.idxTable.insertOne({
                                                    "index": usr.index,
                                                    "group": usr.group
                                                },
                                                    { w: 1 },
                                                    function (err, result) {
                                                        assert.equal(err, null);
                                                        socket.emit("messageOUT", { message: { 'type': 'IndexTable', 'option': 'create', 'data': { '_id': result.insertedId.toString() } } });
                                                    }
                                                );
                                            };
                                        }
                                        if (msg.action == 'delete') {
                                            console.log(uSession.uuid+'/'+uSession.userName  + ' | IndexTable => Delete');
                                            var usr = msg.data;
                                            //console.log(usr);
                                            if (usr._id != null) {
                                                var id = { "_id": ObjectId(usr._id) };
                                                collections.idxTable.remove(
                                                    id, // query
                                                    { '_id': 'asc' },  // sort order
                                                    true,
                                                    function (err, object) {
                                                        if (err) {
                                                            console.warn(err.message);  // returns error if no matching object found
                                                        } else {
                                                            console.log(object);
                                                            socket.emit("messageOUT", { message: { 'type': 'IndexTable', 'option': 'delete', 'data': { '_id': usr._id } } });
                                                        }
                                                    }
                                                );
                                            };
                                        }
                                    }

                                    // Parametres
                                    if (msg.type == 'parametre') {
                                        if (msg.action == 'init') {
                                            console.log(uSession.uuid+'/'+uSession.userName + ' | Parametres => Init');
                                            collections.Parametres.find({},function (err,docs) {
                                                if (docs != null) {
                                                    //console.log(docs);
                                                    socket.emit("messageOUT", { message: { 'type': 'parametre', 'option': 'list', 'data': docs } });
                                                }
                                            });
                                            collections.Parametres.distinct("nom", {}, function (err, items) {
                                                var itemList = items.sort();
                                                socket.emit("messageOUT", { message: { 'type': 'parametre', 'option': 'parNom', 'data': itemList } });
                                            });
                                            collections.Parametres.distinct("group", {}, function (err, items) {
                                                var itemList = items.sort();
                                                socket.emit("messageOUT", { message: { 'type': 'parametre', 'option': 'parGroup', 'data': itemList } });
                                            });
                                        }
                                        if (msg.action == 'get') {
                                            console.log(uSession.uuid+'/'+uSession.userName + ' | Parametres => Get');
                                            var usr = msg.data;
                                            if (usr._id != null) {
                                                var id = { "_id": ObjectId(usr._id) };
                                                var result = collections.Parametres.findOne({ "_id": ObjectId(usr._id) }, function (err, doc) {
                                                    assert.equal(err, null);
                                                    socket.emit("messageOUT", { message: { 'type': 'parametre', 'option': 'get', 'data': doc } });
                                                });
                                            };
                                        }
                                        if (msg.action == 'list') {
                                            console.log(uSession.uuid+'/'+uSession.userName + ' | Parametres => Liste');
                                            var result = collections.Parametres.find({}).toArray(function (err, docs) {
                                                assert.equal(err, null);
                                                socket.emit("messageOUT", { message: { 'type': 'parametre', 'option': 'list', 'data': docs } });
                                            });
                                        }
                                        if (msg.action == 'create') {
                                            var parm = msg.data;
                                            if (parm._id != null) {
                                                console.log(uSession.uuid+'/'+uSession.userName + ' | Parametres => Mise a jour');
                                                //console.log(usr);
                                                var id = { "_id": ObjectId(parm._id) };
                                                collections.Parametres.findOne(id,function (err, params) {
                                                    if(params){
                                                        params.nom = parm.nom;
                                                        params.group = parm.group;
                                                        params.valeur = parm.valeur;
                                                        params.save(function (err, object) {
                                                            socket.emit("messageOUT", { message: { 'type': 'parametre', 'option': 'create', 'data': { '_id': object._id.toString() } } });
                                                        })

                                                    }
                                                });
                                            } else {
                                                console.log(uSession.uuid+'/'+uSession.userName + ' | Parametres => Creation');
                                                delete parm.UserSession;
                                                new collections.Parametres(parm).save(function (err, object) {
                                                    socket.emit("messageOUT", { message: { 'type': 'parametre', 'option': 'create', 'data': { '_id': object._id.toString() } } });
                                                });
                                            };
                                        }
                                        if (msg.action == 'delete') {
                                            console.log(uSession.uuid+'/'+uSession.userName + ' | Parametres => Delete');
                                            var parm = msg.data;
                                            //console.log(parm);
                                            if (parm._id != null) {
                                                var id = { "_id": ObjectId(parm._id) };
                                                collections.Parametres.remove(id,function (err, object) {
                                                    if (err) {
                                                        console.warn(err.message);  // returns error if no matching object found
                                                    } else {
                                                        //console.log(object);
                                                        socket.emit("messageOUT", { message: { 'type': 'parametre', 'option': 'delete', 'data': { '_id': object._id } } });
                                                    }
                                                });
                                            };
                                        }
                                    }
                                    // Utilisateur
                                    if (msg.type == 'user') {
                                        if (msg.action == 'get') {
                                            
                                            var usr = msg.data;
                                            if (usr._id != null) {
                                                var id = { "_id": ObjectId(usr._id) };
                                                var result = collections.Utilisateur.findOne({ "_id": ObjectId(usr._id) }, function (err, doc) {
                                                    assert.equal(err, null);
                                                    //console.log(doc);
                                                    console.log(uSession.uuid+'/'+uSession.userName + ' | User => Get');
                                                    socket.emit("messageOUT", { message: { 'type': 'user', 'option': 'get', 'data': doc } });
                                                });
                                            };
                                        }
                                        if (msg.action == 'list') {
                                            
                                            var result = collections.Utilisateur.find({},function (err, docs) {
                                                assert.equal(err, null);
                                                console.log(uSession.uuid+'/'+uSession.userName + ' | User => Liste');
                                                socket.emit("messageOUT", { message: { 'type': 'user', 'option': 'list', 'data': docs } });
                                            });
                                        }
                                        if (msg.action == 'add') {
                                            var usr = msg.data;
                                            //console.log(usr);
                                            if (usr._id) {
                                                
                                                var id = { "_id": ObjectId(usr._id) };
                                                collections.Utilisateur.findOne(id,function (err, user) {
                                                    if(user){
                                                        Object.keys(usr).forEach(function(key) { user[key] = usr[key]; });
                                                        user.save(function (err) {
                                                            console.log(uSession.uuid+'/'+uSession.userName + ' | User => Mise a jour');
                                                            socket.emit("messageOUT", { message: { 'type': 'user', 'option': 'create', 'data': { '_id': user._id.toString() } } });
                                                        })
                                                    }
                                                }) 
                                            }else{
                                                delete usr._id;
                                                new collections.Utilisateur(usr).save(function (err, result) {
                                                        assert.equal(err, null);
                                                        console.log(uSession.uuid+'/'+uSession.userName + ' | User => Creation');
                                                        socket.emit("messageOUT", { message: { 'type': 'user', 'option': 'create', 'data': { '_id': result._id.toString() } } });
                                                    }
                                                );
                                            };
                                        }
                                        if (msg.action == 'delete') {
                                            var usr = msg.data;
                                            //console.log(usr);
                                            if (usr._id != null) {
                                                var id = { "_id": ObjectId(usr._id) };
                                                collections.Utilisateur.remove(id,function (err) {
                                                    if (err) {
                                                        console.warn(err.message);  // returns error if no matching object found
                                                    } else {
                                                        console.log(uSession.uuid+'/'+uSession.userName + ' | User => Delete');
                                                        socket.emit("messageOUT", { message: { 'type': 'user', 'option': 'delete', 'data': { '_id': usr._id } } });
                                                    }
                                                });
                                            };
                                        }
                                    }
                                    // Articles
                                    if (msg.type == 'article') {
                                        console.log(uSession.uuid+'/'+uSession.userName + ' | aaaa => Articles');
                                        var art = msg.data;
                                        if (msg.action == 'get') {
                                            console.log(uSession.uuid+'/'+uSession.userName + ' | aaaa => Get');
                                            if (art._id != null) {
                                                var id = { "_id": ObjectId(art._id) };
                                                var result = db.collection('Articles').findOne({ "_id": ObjectId(art._id) }, function (err, doc) {
                                                    assert.equal(err, null);
                                                    socket.emit("messageOUT", { message: { 'type': 'article', 'option': 'get', 'data': doc } });
                                                });
                                            };
                                        }
                                        if (msg.action == 'list') {
                                            console.log(uSession.uuid+'/'+uSession.userName + ' | aaaa => Liste');
                                            var result = db.collection('Articles').find({}).toArray(function (err, docs) {
                                                assert.equal(err, null);
                                                socket.emit("messageOUT", { message: { 'type': 'article', 'option': 'list', 'data': docs } });
                                            });
                                        }
                                        if (msg.action == 'create') {
                                            if (art._id != null) {
                                                console.log(uSession.uuid+'/'+uSession.userName + ' | aaaa => Mise a jour');
                                                var id = { "_id": ObjectId(art._id) };
                                                db.collection('Articles').findAndModify(
                                                    id, // query
                                                    { '_id': 'asc' },  // sort order
                                                    {
                                                        $set: {
                                                            "designation": art.designation,
                                                            "datemiseenligne": art.datemiseenligne,
                                                            "iduser": art.iduser,
                                                            "categorie": art.categorie,
                                                            "codepostal": art.codepostal,
                                                            "description": art.description,
                                                            "prix": art.prix,
                                                            "idboutique": art.idboutique
                                                        }
                                                    },
                                                    { upsert: true },
                                                    { new: true },
                                                    function (err, object) {
                                                        if (err) {
                                                            console.warn(err.message);  // returns error if no matching object found
                                                        } else {
                                                            socket.emit("messageOUT", { message: { 'type': 'article', 'option': 'create', 'data': { '_id': object.value._id.toString() } } });
                                                        }
                                                    }
                                                );
                                            } else {
                                                console.log(uSession.uuid+'/'+uSession.userName + ' | aaaa => Creation');
                                                db.collection('Articles').insertOne({
                                                    "designation": art.designation,
                                                    "datemiseenligne": art.datemiseenligne,
                                                    "iduser": art.iduser,
                                                    "categorie": art.categorie,
                                                    "codepostal": art.codepostal,
                                                    "description": art.description,
                                                    "prix": art.prix,
                                                    "idboutique": art.idboutique
                                                },
                                                    { w: 1 },
                                                    function (err, result) {
                                                        assert.equal(err, null);
                                                        socket.emit("messageOUT", { message: { 'type': 'article', 'option': 'create', 'data': { '_id': result.insertedId.toString() } } });
                                                    }
                                                );
                                            };
                                        }
                                        if (msg.action == 'delete') {
                                            console.log(uSession.uuid+'/'+uSession.userName + ' | aaaa => Delete');
                                            console.log(art);
                                            if (art._id != null) {
                                                var id = { "_id": ObjectId(art._id) };
                                                db.collection('Articles').remove(
                                                    id, // query
                                                    { '_id': 'asc' },  // sort order
                                                    true,
                                                    function (err, object) {
                                                        if (err) {
                                                            console.warn(err.message);  // returns error if no matching object found
                                                        } else {
                                                            console.log(object);
                                                            socket.emit("messageOUT", { message: { 'type': 'article', 'option': 'delete', 'data': { '_id': art._id } } });
                                                        }
                                                    }
                                                );
                                            };
                                        };
                                    };
                                    // Boutiques
                                    if (msg.type == 'boutique') {
                                        console.log(uSession.uuid+'/'+uSession.userName + ' | aaaa => Boutiques');
                                        var bou = msg.data;
                                        if (msg.action == 'get') {
                                            console.log(uSession.uuid+'/'+uSession.userName + ' | aaaa => Get');
                                            if (bou._id != null) {
                                                var id = { "_id": ObjectId(bou._id) };
                                                var result = db.collection('Boutiques').findOne({ "_id": ObjectId(bou._id) }, function (err, doc) {
                                                    assert.equal(err, null);
                                                    socket.emit("messageOUT", { message: { 'type': 'boutique', 'option': 'get', 'data': doc } });
                                                });
                                            };
                                        }
                                        if (msg.action == 'list') {
                                            console.log(uSession.uuid+'/'+uSession.userName + ' | aaaa => Liste');
                                            var result = db.collection('Boutiques').find({}).toArray(function (err, docs) {
                                                assert.equal(err, null);
                                                socket.emit("messageOUT", { message: { 'type': 'boutique', 'option': 'list', 'data': docs } });
                                            });
                                        }
                                        if (msg.action == 'create') {
                                            if (bou._id != null) {
                                                console.log(uSession.uuid+'/'+uSession.userName + ' | aaaa => Mise a jour');
                                                var id = { "_id": ObjectId(bou._id) };
                                                db.collection('Boutiques').findAndModify(
                                                    id, // query
                                                    { '_id': 'asc' },  // sort order
                                                    {
                                                        $set: {
                                                            "titre": bou.titre,
                                                            "telephone": bou.telephone,
                                                            "iduser": bou.iduser,
                                                            "categorie": bou.categorie,
                                                            "codepostal": bou.codepostal,
                                                            "description": bou.description,
                                                            "adresse": bou.adresse
                                                        }
                                                    },
                                                    { upsert: true },
                                                    { new: true },
                                                    function (err, object) {
                                                        if (err) {
                                                            console.warn(err.message);  // returns error if no matching object found
                                                        } else {
                                                            socket.emit("messageOUT", { message: { 'type': 'boutique', 'option': 'create', 'data': { '_id': object.value._id.toString() } } });
                                                        }
                                                    }
                                                );
                                            } else {
                                                console.log(uSession.uuid+'/'+uSession.userName + ' | aaaa => Creation');
                                                db.collection('Boutiques').insertOne({
                                                    "titre": bou.titre,
                                                    "telephone": bou.telephone,
                                                    "iduser": bou.iduser,
                                                    "categorie": bou.categorie,
                                                    "codepostal": bou.codepostal,
                                                    "description": bou.description,
                                                    "adresse": bou.adresse
                                                },
                                                    { w: 1 },
                                                    function (err, result) {
                                                        assert.equal(err, null);
                                                        socket.emit("messageOUT", { message: { 'type': 'boutique', 'option': 'create', 'data': { '_id': result.insertedId.toString() } } });
                                                    }
                                                );
                                            };
                                        }
                                        if (msg.action == 'delete') {
                                            console.log(uSession.uuid+'/'+uSession.userName + ' | aaaa => Delete');
                                            console.log(bou);
                                            if (bou._id != null) {
                                                var id = { "_id": ObjectId(bou._id) };
                                                db.collection('Boutiques').remove(
                                                    id, // query
                                                    { '_id': 'asc' },  // sort order
                                                    true,
                                                    function (err, object) {
                                                        if (err) {
                                                            console.warn(err.message);  // returns error if no matching object found
                                                        } else {
                                                            console.log(object);
                                                            socket.emit("messageOUT", { message: { 'type': 'boutique', 'option': 'delete', 'data': { '_id': bou._id } } });
                                                        }
                                                    }
                                                );
                                            };
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
                if (diag) {

                }
            });
            //----
            //---- upload addon
            var delivery = dl.listen(socket);
            delivery.on('receive.success', function (file) {
                var params = file.params;
                var pathFileUp = './uploads/' + Date.now() + '_' + file.name;

                fs.writeFile(pathFileUp, file.buffer, function (err) {
                    if (err) {
                        console.log('File could not be saved.');
                    } else {
                        //console.log('upload Termine.', file.name);
                        if (file.name) {
                            console.log(clientIpAddress + ' | ArchiveDoc => Archivage du fichier : ' + file.name);
                            var writestream = gfs.createWriteStream({
                                filename: file.name
                            });
                            fs.createReadStream(pathFileUp).pipe(writestream);
                            writestream.on('close', function (arc) {
                                console.log(arc);
                                socket.emit("messageOUT", { message: { 'type': 'ArchiveDoc', 'option': 'ArcDocOK', 'data': arc } });
                                fs.unlink(pathFileUp, function (err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log(clientIpAddress + ' | ArchiveDoc => Supprime : ' + arc.filename);
                                    }
                                });
                            });
                        }

                    };
                });
            });
        });
        return io;
    }
};