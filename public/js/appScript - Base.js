
        
var SybDybAppVw = angular.module('SybDybAppVw', ["ngStorage"]);

SybDybAppVw.controller('firstCtrl', ['$scope', '$document', '$localStorage', function ($scope, $document, $localStorage) {
    //$scope.sValue = 'OK';
    //$scope.title = 'Paramétrage';
    var delivery;

    var socket = io();
    socket.on('connect', function () {
        var _delivery = new Delivery(socket);

        _delivery.on('delivery.connect', function (delivery) {
            console.log('Connecte a delivery');
        });
        _delivery.on('send.start', function (filePackage) {
            console.log(filePackage.name + " is being sent to the client.");
        });
        _delivery.on('send.success', function (uid) {
            console.log("File successfully sent!");
        });
        _delivery.on('file.load', function (filePackage) {
            console.log(filePackage.name + " has just been loaded.");
        });
        delivery = _delivery;
    });
    socket.on("messageOUT", function(data) {
        var msg = data["message"];
        //-----
         if (msg.type == 'Session') {
            if (msg.option == 'connect') {
                var doc = msg.data;
                if (doc.uuid){
                    
                    $scope.UserConnInfo.userid = doc._id;
                    $scope.UserConnInfo.uuid = doc.uuid;
                    $scope.UserConnInfo.timestamp = doc.timestamp;
                    $scope.UserConnInfo.state = doc.state;
                    $scope.UserConnInfo.userName = doc.userName;
                    //--
                    $localStorage.UserConnInfo = $scope.UserConnInfo;
                    //info(console.log($localStorage.UserConnInfo));
                    window.location.href = '/iadb' ;
                };
            };
        }
        if (msg.type == 'iaTchat') {
            if (msg.option == 'Write') {
                var doc = msg.data;
                //console.log(doc);
                $scope.AddiaTchat(doc);
            };
            if (msg.option == 'listLast') {
                var iaTchatList = msg.data;
                iaTchatList.reverse();
                iaTchatList.forEach(function (iaT) {
                    $scope.AddiaTchat(iaT);
                });
                //console.log(doc);
                //$scope.iaTchat = doc;
                //var iaTchatList = [];
                //iaTchatList = $scope.iaTchat;
                //iaTchatList.push(doc);
                //iaTchatList.sort();
                //$scope.iaTchat = iaTchatList;
            };
        }
        if (msg.type == 'Contact') {
            if (msg.option == 'list') {
                var doc = msg.data;
                $scope.ListContact= doc;
                //console.log(doc);
                //var ContactList = [];
                //ContactList = $scope.ListContact;
                //ContactList.push(doc);
                //ContactList.sort();
                //$scope.ListContact = ContactList;
            };
            if (msg.option == 'getOk') {
                var doc = msg.data;
                //console.log(doc);
                $scope.contact._id = doc._id;
                $scope.contact.IDAgence = doc.IDAgence;
                $scope.contact.DateCreation = doc.DateCreation;
                $scope.contact.Nom = doc.Nom;
                $scope.contact.Prenom =  doc.Prenom;
                $scope.contact.DateDeNaissance = doc.DateDeNaissance;
                $scope.contact.Mail = doc.Mail;
                $scope.contact.Telephone = doc.Telephone; 
                $scope.contact.Portable = doc.Portable;
                $scope.contact.Adresse = doc.Adresse;
                $scope.contact.CodePostale = doc.CodePostale; 
                $scope.contact.Ville = doc.Ville;
                $scope.contact.ProjetContact = doc.ProjetContact;
            };
            if (msg.option == 'addOK') {
                var doc = msg.data;
                //console.log(doc._id);
                $scope.contact._id = doc._id;
                //$scope.ContactForm.reset();
                $scope.closeContact();
            };
        }
        //-----
        if (msg.type == 'Temps') {
            if (msg.option == 'list') {
                var doc = msg.data;
                //console.log(doc);
                var TempsList = [];
                TempsList = $scope.ListTemps;
                TempsList.push(doc);
                TempsList.sort();
                $scope.ListTemps = TempsList;
            };
            if (msg.option == 'getOk') {
                var doc = msg.data;
                //console.log(doc);
                $scope.temps._id = doc._id;
                $scope.temps.IDUtilisateur = doc.IDUtilisateur;
                $scope.temps.DateDebut = doc.DateDebut;
                $scope.temps.HeureDebut = doc.HeureDebut;
                $scope.temps.HeureFin =  doc.HeureFin;
                $scope.temps.Commentaire = doc.Commentaire;
                $scope.temps.IDTache = doc.IDTache;
                $scope.temps.IDClient = doc.IDClient; 
                $scope.temps.IDProjet = doc.IDProjet;
            };
            if (msg.option == 'addOK') {
                var doc = msg.data;
                //console.log(doc._id);
                $scope.temps._id = doc._id;
            };
        }
        if (msg.type == 'Tache') {
            if (msg.option == 'list') {
                var doc = msg.data;
                //console.log(doc);
                var TacheList = [];
                TacheList = $scope.ListTache;
                TacheList.push(doc);
                TacheList.sort();
                $scope.ListTache = TacheList;

                //$scope.SuiviTacheList = doc;
            };
            if (msg.option == 'addOK') {
                var doc = msg.data;
                //console.log(doc._id);
                $scope.tache._id = doc._id;
            };
        }
        if (msg.type == 'Projet') {
            if (msg.option == 'list') {
                var doc = msg.data;
                //console.log(doc);
                var ProjetList = [];
                ProjetList = $scope.ListProjet;
                ProjetList.push(doc);
                ProjetList.sort();
                $scope.ListProjet = ProjetList;

                //$scope.SuiviTacheList = doc;
            };
            if (msg.option == 'addOK') {
                var doc = msg.data;
                //console.log(doc._id);
                $scope.projet._id = doc._id;
            };
        }
        if (msg.type == 'Client') {
            if (msg.option == 'list') {
                var doc = msg.data;
                //console.log(doc);
                var ClientList = [];
                ClientList = $scope.ListClient;
                ClientList.push(doc);
                ClientList.sort();
                $scope.ListClient = ClientList;

                //$scope.SuiviTacheList = doc;
            };
            if (msg.option == 'addOK') {
                var doc = msg.data;
                //console.log(doc._id);
                $scope.client._id = doc._id;
            };
        }
        if (msg.type == 'ArchiveDoc') {
            if (msg.option == 'ArcDocOK') {
                var doc = msg.data;
                window.location.href = '/archives/add/' + doc._id;
            };
            if (msg.option == 'ArcOK') {
                var doc = msg.data;
                //console.log(doc);
                $scope.ArcDocID = doc._id;
                $scope.ArcDocFName = doc.filename;
                $scope.ArcOK = true;
                $scope.searchCriteres = [];
            };
            if (msg.option == 'ArcNOK') {
                var doc = msg.data;
                $scope.ArcDocID = '';
                $scope.ArcDocFName = '';
                $scope.ArcOK = false;
                $scope.searchCriteres = [];
            };
            if (msg.option == 'ArcIdxSaveOK') {
                var doc = msg.data;
                //console.log(doc);
                $scope.ArcDocID = doc._id;
                $scope.ArcDocFName = 'Indexation OK';
                $scope.MngIdx = false;
                $scope.searchCriteres = [];
            };
            if (msg.option == 'GererIdxOK') {
                var doc = msg.data;
                //console.log(doc);
                //$scope.ArcDocID = doc._id;
                //$scope.ArcDocFName = 'Indexation OK';
                //$scope.ArcOK = false;
                $scope.searchCriteres = doc;
            };
        }
		if(msg.type == 'SunArchives'){
			if(msg.option == 'assist'){
				//console.log(msg);
				var doc = msg.data;
				//console.log(doc);
				var IndexValList = [];
				IndexValList = $scope.IndexValLists;
				IndexValList.push(doc);
				IndexValList.sort();
				$scope.IndexValLists = IndexValList;
				//$scope.IndexValLists1 = doc;
			};

			if(msg.option == 'search'){
				var doc = msg.data;
				var searchResultat = [];
				searchResultat = $scope.searchResults;
				searchResultat.push(doc);
				$scope.searchResults = searchResultat;
				
				//$scope.searchResults = doc;
			};
		}
		if(msg.type == 'user'){
			if(msg.option == 'list'){
                var doc = msg.data;
                $scope.ListUtilisateur = doc;
			};
			if(msg.option == 'get'){
				var doc = msg.data;

                $scope.Utilisateur._id = doc._id;
                $scope.Utilisateur.nom = doc.nom;
                $scope.Utilisateur.nomAlias = doc.nomAlias;
                $scope.Utilisateur.Mail = doc.Mail;
                $scope.Utilisateur.Tel = doc.Tel;
                $scope.Utilisateur.Commentaire = doc.Commentaire;
                $scope.Utilisateur.Password = doc.Password;
                $scope.Utilisateur.Droits = doc.Droits;
                $scope.Utilisateur.nomCivil = doc.nomCivil;
                $scope.Utilisateur.PrenomCivil = doc.PrenomCivil;
			};
			if(msg.option == 'create'){
				var doc = msg.data;
				$scope.Utilisateur._id = doc._id;
				socket.emit("messageIN", {message : {'type':'user','action':'list'}});
			};
		}

		if(msg.type == 'parametre'){
			if(msg.option == 'clientIpAddress'){
				var doc = msg.data;
				$scope.clientIpAddress = doc;
			};
			if(msg.option == 'IndexLien'){
				var doc = msg.data;
				$scope.IndexLiens = doc;
			};
			if(msg.option == 'IndexCdt'){
				var doc = msg.data;
				$scope.IndexCdts = doc;
			};
			if(msg.option == 'userCat'){
				var doc = msg.data;
				$scope.userCats = doc;
			};
			if(msg.option == 'articleCat'){
				var doc = msg.data;
				$scope.articleCats = doc;
			};
			if(msg.option == 'boutiqueCat'){
				var doc = msg.data;
				$scope.boutiqueCats = doc;
			};
			if(msg.option == 'parGroup'){
				var doc = msg.data;
				$scope.parGroups = doc;
			};
			if(msg.option == 'parNom'){
				var doc = msg.data;
				$scope.parNoms = doc;
			};
			if(msg.option == 'list'){
				var doc = msg.data;
				$scope.Parametres = doc;
			};
			if(msg.option == 'get'){
				var doc = msg.data;
				$scope.par_nom = doc.nom;
				$scope.par_group = doc.group;
				$scope.par_valeur = doc.valeur;
				$scope.par_id = doc._id;
			
			};
			if(msg.option == 'create'){
				var doc = msg.data;
				$scope.par_id = doc._id;
				//socket.emit("messageIN", {message : {'type':'parametre','action':'list'}}); // redondance?
			};
		}
		if(msg.type == 'IndexTable'){
			if(msg.option == 'indexGroup'){
				var doc = msg.data;
				$scope.indexGroups = doc;
			};
			if(msg.option == 'indexNom'){
				var doc = msg.data;
				$scope.indexNoms = doc;
			};
			if(msg.option == 'list'){
				var doc = msg.data;
				$scope.IndexTables = doc;
			};
			if(msg.option == 'get'){
				var doc = msg.data;
				$scope.index_nom = doc.index;
				$scope.index_group = doc.group;
				$scope.index_id = doc._id;
			
			};
			if(msg.option == 'create'){
				var doc = msg.data;
				$scope.index_id = doc._id;
				//socket.emit("messageIN", {message : {'type':'parametre','action':'list'}}); // redondance?
			};
		}
		if(msg.type == 'SunArchives'){
			if(msg.option == 'IndexList'){
				var doc = msg.data;
				$scope.IndexLists = doc;
			};
		}
		$scope.$apply();
	});
	
	// initialisation des variables 
	var d = new Date();
	$scope.DateDuJour = d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear();
    $scope.usr_id = null;//'newId';
    $scope.UserConnInfo = {
        userid : '',
        uuid : '',
        timestamp : '',
        state : '',
        userName : '',
        address : ''
    };
    var vNbPage = 0;
    $scope.ListSearchRPage = vNbPage;
    $scope.iaTchat = [];
    $scope.searchCriteres = [];
    $scope.ProjetContact = [];
    $scope.infoEtapeList = [
        {
            'Titre':'Informations relatives à votre projet',
            'Champs':['Commencer']
        },
        {
            'Titre':'Votre projet',
            'Champs':['Acheter un bien','Construire','Faire des travaux','Renégocier mon prêt immo','Autre']
        },
        {
            'Titre':'Type de bien',
            'Champs':['Maison','Appartement','Terrain + construction','Terrain seul','Autres']
        },
        {
            'Titre':'Etat du bien',
            'Champs':['Ancien','Neuf','Vent sur plan (VEFA)']
        },
        {
            'Titre':'Usage du bien',
            'Champs':['Residence principale','Residence secondaire','Investissement locatif','sage professionnel ou commercial','Usage mixte du bien']
        },
        {
            'Titre':'Situation actuelle',
            'Champs':['Locataire','Propriétaire','Hébergé a titre gratuit']
        },
        {
            'Titre':'Etat du Projet',
            'Champs':['Vous débutez recherche','En recherche active','Déjà trouvé, pensez signer une promesse d\'achat','Vous avez signe une promesse d\'achat']
        },
        {
            'Titre':'Ou se situe le bien',
            'Champs':['France','Etranger']
        },
        {
            'Titre':'Nombre d\'emprunteur',
            'Champs':['Seul(e)','Avec co-emprunteur','Dans le cadre d\'une S.C.I.']
        },
        {
            'Titre':'Montant estimé de l\'aquisition ou des travaux',
            'Champs':['Moins de 50 000 €','Entre 50 000 et 100 000 €','Plus de 100 000 €']
        },
        {
            'Titre':'Voila c\'est fini',
            'Champs':[]
        }
    ];
    $scope.infoEtape = $scope.infoEtapeList[0];
    //console.log($scope.infoEtape);
    $scope.TodoList = [];
    $scope.SuiviTacheList = [];
    $scope.ListProjet = [];
    $scope.ListClient = [];
    $scope.ListTache = [];
    $scope.ListTemps = [];
    $scope.ListContact = [];
    $scope.ListUtilisateur = [];
    //$scope.contact.DateDeNaissance = d;
    $scope.ListAgence = [
		{'_id':'Oceane','Nom':'Oceane'}
    ];
    $scope.ArcOk = false;
    $scope.MngIdx = false;
    $scope.Utilisateur = {
        _id: '',
        nom: '',
        nomAlias: '',
        Mail: '',
        Tel: '',
        Commentaire: '',
        Password: '',
        Droits: '',
        UsrCrt: '',
        DatCrt: '',
        UsrUpd: '',
        DatUpd: '',
        nomCivil: '',
        PrenomCivil: ''
    };
    $scope.temps = {
        _id: '',
        IDUtilisateur: '',
        DateDebut: '',
        HeureDebut: '',
        HeureFin: '',
        Commentaire: '',
        IDTache: '',
        IDClient: '',
        IDProjet: '',
    };
    $scope.tache = {
        _id: '',
        IDUtilisateur: '',
        Nom: '',
        Etat: '',
        Detail: '',
        IDClient: '',
        IDProjet: '',
    };
    $scope.projet = {
        _id: '',
        Nom: '',
        DateDebut: '',
        Etat: '',
        DateDeFin: '',
        Description: '',
        DureePrevue: '',
        IDClient: '',
        IdUtilisateur: '',
    };
    $scope.client = {
        _id: '',
        Nom: '',
        Mail: '',
        Tel: '',
        Adresse: '',
    };
    $scope.contact = {
        _id: '',
        IDAgence: '',
        DateCreation: '',
        Nom: '',
        Prenom: '',
        DateDeNaissance: '',
        Mail: '',
        Telephone: '',
        Portable: '',
        Adresse: '',
        CodePostale: '',
        Ville: '',
    };
    KEY_ENTER			= 13;
    KEY_ESC				= 27;

    //document.onkeyup = applyKey;

    //-- init application
    socket.emit("messageIN", { message: { 'type': 'parametre', 'action': 'init', 'data': {UserSession:$localStorage.UserConnInfo} } });

    function applyKey (_event_){
        var winObj = checkEventObj(_event_);
        var intKeyCode = winObj.keyCode;
        if (intKeyCode == KEY_ENTER) {
            $scope.SendUserAsk($scope.UserAsk);
        }
    }
    function checkEventObj ( _event_ ){
        // --- IE explorer
        if ( window.event ){
            return window.event;
        // --- Netscape and other explorers
        }else{
            return _event_;
        }
    }

    //-- iaTchat
    $scope.AddiaTchat = function (iaTchat) {
        //$scope.iaTchat = [];
        d = new Date(iaTchat.date);
        var tTabA = [{user:iaTchat.user,texte:iaTchat.texte,date:d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear(),time:d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()}];
        var tTabB = $scope.iaTchat;
        var tTabC = [];
        if(tTabB.length > 1 ){
            if(tTabB[0].date != tTabA[0].date ){
                var tTabD = [{user:"",texte:"Conversation pour la journée du "+d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear(),date:"00"+"/"+"00"+"/"+"0000",time:d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear()}];
                tTabA = tTabA.concat(tTabD);  
            }
        }
        tTabC = tTabA.concat(tTabB);  
        while (tTabC.length > 20 ){
           tTabC.pop();
        }  
        $scope.iaTchat = tTabC;  
    }
    //-- iaTchat SendUserAsk
    $scope.SendUserAsk = function (val) {
        //$scope.iaTchat = [];
        d = new Date();
        //$scope.AddiaTchat(val,usr);
        var ask = {texte:val,date:d,UserSession:$localStorage.UserConnInfo};
        var msg = { 'type': 'iaTchat', 'action': 'ask', 'data': ask };
        socket.emit("messageIN", { message: msg });
        $scope.UserAsk = '';  
        document.getElementById("UserAsk").focus();  
        document.getElementById("UserAsk").select();
    }
    // closeUtilisateur
    $scope.closeUtilisateur = function () {
        // console.log('fermeture');
        $scope.Utilisateur._id= '';
        $scope.Utilisateur.nom= '';
        $scope.Utilisateur.nomAlias= '';
        $scope.Utilisateur.Mail= '';
        $scope.Utilisateur.Tel= '';
        $scope.Utilisateur.Commentaire= '';
        $scope.Utilisateur.Password= '';
        $scope.Utilisateur.Droits= '';
        $scope.Utilisateur.UsrCrt= '';
        $scope.Utilisateur.DatCrt= '';
        $scope.Utilisateur.UsrUpd= '';
        $scope.Utilisateur.DatUpd= '';
        $scope.Utilisateur.nomCivil= '';
        $scope.Utilisateur.PrenomCivil= '';
        document.getElementById('popUtilisateur').style.display = 'none';
    };
    //-- openUtilisateur
    $scope.openUtilisateur = function (id) {
        
        if (id >= 0) {
            $scope.Utilisateur._id = $scope.ListUtilisateur[id]._id;
            $scope.Utilisateur.nom = $scope.ListUtilisateur[id].nom;
            $scope.Utilisateur.nomAlias = $scope.ListUtilisateur[id].nomAlias;
            $scope.Utilisateur.Mail = $scope.ListUtilisateur[id].Mail;
            $scope.Utilisateur.Tel = $scope.ListUtilisateur[id].Tel;
            $scope.Utilisateur.Commentaire = $scope.ListUtilisateur[id].Commentaire;
            $scope.Utilisateur.Password = $scope.ListUtilisateur[id].Password;
            $scope.Utilisateur.Droits = $scope.ListUtilisateur[id].Droits;
            $scope.Utilisateur.UsrCrt = $scope.ListUtilisateur[id].UsrCrt;
            $scope.Utilisateur.DatCrt = $scope.ListUtilisateur[id].DatCrt;
            $scope.Utilisateur.UsrUpd = $scope.ListUtilisateur[id].UsrUpd;
            $scope.Utilisateur.DatUpd = $scope.ListUtilisateur[id].DatUpd;
            $scope.Utilisateur.nomCivil = $scope.ListUtilisateur[id].nomCivil;
            $scope.Utilisateur.PrenomCivil = $scope.ListUtilisateur[id].PrenomCivil;

            //var msg = { 'type': 'Client', 'action': 'get', 'data': { '_id': $scope.ListClient[id]._id } };
            //socket.emit("messageIN", { message: msg });
        } else {
            //console.log('ouverture');Tache
            $scope.Utilisateur._id= '';
            $scope.Utilisateur.nom= '';
            $scope.Utilisateur.nomAlias= '';
            $scope.Utilisateur.Mail= '';
            $scope.Utilisateur.Tel= '';
            $scope.Utilisateur.Commentaire= '';
            $scope.Utilisateur.Password= '';
            $scope.Utilisateur.Droits= '';
            $scope.Utilisateur.UsrCrt= '';
            $scope.Utilisateur.DatCrt= '';
            $scope.Utilisateur.UsrUpd= '';
            $scope.Utilisateur.DatUpd= '';
            $scope.Utilisateur.nomCivil= '';
            $scope.Utilisateur.PrenomCivil= '';
            //$scope.$apply();
        };
        //$scope.$apply();
        document.getElementById('popUtilisateur').style.display = 'block';
    };
    
    //-- AjouterUtilisateur
    $scope.AjouterUtilisateur = function (usr) {
        $scope.ListUtilisateur = [];
        var msg = { 'type': 'Utilisateur', 'action': 'add', 'data': usr };
        socket.emit("messageIN", { message: msg });
    };
    //-- addProjetContact
    $scope.addProjetContact = function (val) {
        //console.log(val);
        //console.log($scope.infoEtape.Titre +' => '+$scope.infoEtape.Champs[val]);

        var nb = $scope.ListSearchRPage;
        //console.log(nb);
        if (nb == 0) { 
            $scope.ProjetContact = []; 
        }else{
            if(nb < ($scope.infoEtapeList.length - 1)){
                var objTmp = {};
                //console.log(objTmp);
                objTmp.Question = $scope.infoEtape.Titre;
                objTmp.Reponse = $scope.infoEtape.Champs[val];
                console.log(objTmp);
                var tabTmp = [];
                tabTmp = $scope.ProjetContact;
                tabTmp.push(objTmp);
                //console.log(tabTmp);
                $scope.ProjetContact = tabTmp;
            }
            
        };
        
        $scope.PageEtape('+');
        //$scope.searchResults = []; 
        
    }
    //-- PageEtape
    $scope.PageEtape = function (val) {
        //$scope.searchResults = []; $scope.ProjetContact
        var nb = $scope.ListSearchRPage;
        if (val == '+') { nb += 1; };
        if (val == '-') { nb -= 1; };
        if (nb < 0) { nb = 0; };
        if (nb > ($scope.infoEtapeList.length - 1)) { nb = ($scope.infoEtapeList.length - 1); };
        $scope.ListSearchRPage = nb;
        $scope.infoEtape = $scope.infoEtapeList[nb];
        
    }
    // closeCContact
    $scope.closeContact = function () {
        // console.log('fermeture');
        $scope.contact._id = '';
        $scope.contact.IDAgence = '';
        $scope.contact.DateCreation = '';
        $scope.contact.Nom = '';
        $scope.contact.Prenom = '';
        $scope.contact.DateDeNaissance = '';
        $scope.contact.Mail = '';
        $scope.contact.Telephone = '';
        $scope.contact.Portable = '';
        $scope.contact.Adresse = '';
        $scope.contact.CodePostale = '';
        $scope.contact.Ville = '';
        document.getElementById('popContact').style.display = 'none';
    };
    //-- openContact openUtilisateur
    $scope.openContact = function (id) {
        
        if (id >= 0) {
            //console.log($scope.ListClient[id]);
            $scope.contact._id = $scope.ListContact[id]._id;
            $scope.contact.IDAgence = $scope.ListContact[id].IDAgence;
            $scope.contact.DateCreation = $scope.ListContact[id].DateCreation;
            $scope.contact.Nom = $scope.ListContact[id].Nom;
            $scope.contact.Prenom = $scope.ListContact[id].Prenom;
            $scope.contact.DateDeNaissance = $scope.ListContact[id].DateDeNaissance;
            $scope.contact.Mail = $scope.ListContact[id].Mail;
            $scope.contact.Telephone = $scope.ListContact[id].Telephone;
            $scope.contact.Portable = $scope.ListContact[id].Portable;
            $scope.contact.Adresse = $scope.ListContact[id].Adresse;
            $scope.contact.CodePostale = $scope.ListContact[id].CodePostale;
            $scope.contact.Ville = $scope.ListContact[id].Ville;

            //var msg = { 'type': 'Client', 'action': 'get', 'data': { '_id': $scope.ListClient[id]._id } };
            //socket.emit("messageIN", { message: msg });
        } else {
            //console.log('ouverture');Tache
            $scope.contact._id = '';
            $scope.contact.IDAgence = '';
            $scope.contact.DateCreation = '';
            $scope.contact.Nom = '';
            $scope.contact.Prenom = '';
            $scope.contact.DateDeNaissance = '';
            $scope.contact.Mail = '';
            $scope.contact.Telephone = '';
            $scope.contact.Portable = '';
            $scope.contact.Adresse = '';
            $scope.contact.CodePostale = '';
            $scope.contact.Ville = '';
            //$scope.$apply();
        };
        //$scope.$apply();
        document.getElementById('popContact').style.display = 'block';
    };
    //-- AjouterContact
    $scope.AjouterContact = function (contact) {
        $scope.ListContact = [];
        contact.DateCreation =  $scope.DateDuJour;
        contact.ProjetContact =  $scope.ProjetContact;
        contact.UserSession = $localStorage.UserConnInfo;
        var msg = { 'type': 'Contact', 'action': 'add', 'data': contact };
        socket.emit("messageIN", { message: msg });
    };
    //-- PageContact
    $scope.PageContact = function (val) {
        //$scope.searchResults = [];
        var nb = $scope.ListSearchRPage;
        if (val == '+') { nb += 1; };
        if (val == '-') { nb -= 1; };
        if (nb < 0) { nb = 0; };
        $scope.ListSearchRPage = nb;
        $scope.getContact(nb);
        
    }
    //-- getContact
    $scope.getContact = function (page) {
        //console.log(tache);
        $scope.ListContact = [];
        var msg = { 'type': 'Contact', 'action': 'list', 'data': {'page': page,UserSession:$localStorage.UserConnInfo } };
        socket.emit("messageIN", { message: msg });
    };

    //---
    $scope.openNode = function (num) {
        var x = document.getElementById("idNode" + num);
        if (x.className.indexOf("w3-show") == -1) {
            x.className += " w3-show";
        } else {
            x.className = x.className.replace(" w3-show", "");
        }
    }
    // closeClient
    $scope.closeClient = function () {
        // console.log('fermeture');
        $scope.client._id = '';
        $scope.client.Nom = '';
        $scope.client.Mail = '';
        $scope.client.Tel = '';
        document.getElementById('popClient').style.display = 'none';
    };
    //-- openClient
    $scope.openClient = function (id) {
        
        if (id >= 0) {
            //console.log($scope.ListClient[id]);
            $scope.client._id = $scope.ListClient[id]._id;
            $scope.client.Nom = $scope.ListClient[id].Nom;
            $scope.client.Mail = $scope.ListClient[id].Mail;
            $scope.client.Tel = $scope.ListClient[id].Tel;
            $scope.client.IDClient = $scope.ListClient[id].IDClient;

            //var msg = { 'type': 'Client', 'action': 'get', 'data': { '_id': $scope.ListClient[id]._id } };
            //socket.emit("messageIN", { message: msg });
        } else {
            //console.log('ouverture');Tache
            $scope.client._id = '';
            $scope.client.Nom = '';
            $scope.client.Mail = '';
            $scope.client.Tel = '';
            //$scope.$apply();
        };
        //$scope.$apply();
        document.getElementById('popClient').style.display = 'block';
    };
    //-- AjouterClient
    $scope.AjouterClient = function (client) {
        $scope.ListClient = [];
        client.UserSession = $localStorage.UserConnInfo;
        var msg = { 'type': 'Client', 'action': 'add', 'data': client };
        socket.emit("messageIN", { message: msg });
    };
    // closeProjet
    $scope.closeProjet = function () {
        // console.log('fermeture');
        $scope.projet._id = '';
        $scope.projet.Nom = '';
        $scope.projet.Mail = '';
        $scope.projet.Tel = '';
        document.getElementById('popProjet').style.display = 'none';
    };
    //-- openProjet
    $scope.openProjet = function (id) {
        //console.log(id);
        if (id >= 0) {
            console.log($scope.ListProjet[id]);
            $scope.projet._id = $scope.ListProjet[id]._id;
            $scope.projet.IDUtilisateur = $scope.ListProjet[id].IDUtilisateur;
            $scope.projet.Nom = $scope.ListProjet[id].Nom;
            $scope.projet.Etat = $scope.ListProjet[id].Etat;
            $scope.projet.DateDebut = $scope.ListProjet[id].DateDebut;
            $scope.projet.DateDeFin = $scope.ListProjet[id].DateDeFin;
            $scope.projet.Description = $scope.ListProjet[id].Description;
            $scope.projet.IDClient = $scope.ListProjet[id].IDClient;
            $scope.projet.DureePrevue = $scope.ListProjet[id].DureePrevue;
            $scope.projet.IDClient = $scope.ListProjet[id].IDClient;

            //var msg = { 'type': 'Projet', 'action': 'get', 'data': { '_id': $scope.ListProjet[id]._id } };
            //socket.emit("messageIN", { message: msg });
            //document.getElementById('popTemps').style.display = 'block';
        } else {
            //console.log('ouverture');Tache
            $scope.projet._id = '';
            $scope.projet.IDUtilisateur = $scope.UserTemps;
            $scope.projet.Nom = '';
            $scope.projet.Etat = '';
            $scope.projet.DateDebut = '';
            $scope.projet.DateDeFin = '';
            $scope.projet.Description = '';
            $scope.projet.IDClient = '';
            $scope.projet.DureePrevue = '';
            $scope.projet.IDClient = $scope.ListClient[$scope.idClient]._id;
            //$scope.$apply();
        };
        //$scope.$apply();
        document.getElementById('popProjet').style.display = 'block';
    };
    //-- AjouterProjet
    $scope.AjouterProjet = function (projet) {
        //$scope.ListClient = [];
        //$scope.ListTache = [];
        $scope.ListProjet = [];
        projet.UserSession = $localStorage.UserConnInfo;
        var msg = { 'type': 'Projet', 'action': 'add', 'data': projet };
        socket.emit("messageIN", { message: msg });
    };
    // closeTache
    $scope.closeTache = function () {
        // console.log('fermeture');
        $scope.tache._id = '';
        $scope.tache.IDUtilisateur = '';
        $scope.tache.Nom = '';
        $scope.tache.Etat = '';
        $scope.tache.Detail = '';
        $scope.tache.IDClient = '';
        $scope.tache.IDProjet = '';
        document.getElementById('popTache').style.display = 'none';
    };
    //-- openTache
    $scope.openTache = function (id) {
        //console.log(id);
        if (id >= 0) {
            console.log($scope.ListTache[id]);
            $scope.tache._id = $scope.ListTache[id]._id;
            $scope.tache.IDUtilisateur = $scope.ListTache[id].IDUtilisateur;
            $scope.tache.Nom = $scope.ListTache[id].Nom;
            $scope.tache.Etat = $scope.ListTache[id].Etat;
            $scope.tache.Detail = $scope.ListTache[id].Detail;
            $scope.tache.IDClient = $scope.ListTache[id].IDClient;
            $scope.tache.IDProjet = $scope.ListTache[id].IDProjet;

            //var msg = { 'type': 'Tache', 'action': 'get', 'data': { '_id': $scope.ListTache[id]._id } };
            //socket.emit("messageIN", { message: msg });
            //document.getElementById('popTemps').style.display = 'block';
        } else {
            //console.log('ouverture');Tache
            $scope.tache._id = '';
            $scope.tache.IDUtilisateur = $scope.UserTemps;
            $scope.tache.Nom = '';
            $scope.tache.Etat = '';
            $scope.tache.Detail = '';
            $scope.tache.IDClient = $scope.ListClient[$scope.idClient]._id;
            $scope.tache.IDProjet = $scope.ListProjet[$scope.idProjet]._id;
            //$scope.$apply();
        };
        //$scope.$apply();
        document.getElementById('popTache').style.display = 'block';
    };
    //-- AjouterTache
    $scope.AjouterTache = function (tache) {
        $scope.ListTache = [];
        tache.UserSession = $localStorage.UserConnInfo;
        var msg = { 'type': 'Tache', 'action': 'add', 'data': tache };
        socket.emit("messageIN", { message: msg });
    };
    //-- chgClient
    $scope.chgClient = function (id) {
        $scope.ListProjet = [];
        //$scope.ListClient = [];
        $scope.ListTache = [];
        $scope.ListTemps = [];
        $scope.ListSearchRPage = 0;
        var msg = { 'type': 'Projet', 'action': 'list', 'data': { 'IDClient': $scope.ListClient[id]._id} };
        socket.emit("messageIN", { message: msg });

    };
    //-- chgProjet
    $scope.chgProjet = function (id) {
        //$scope.ListProjet = [];
        //$scope.ListClient = [];
        $scope.ListTache = [];
        $scope.ListTemps = [];
        $scope.ListSearchRPage = 0;
        var msg = { 'type': 'Tache', 'action': 'list', 'data': { 'IDProjet': $scope.ListProjet[id]._id } };
        socket.emit("messageIN", { message: msg });

    };
    //-- chgTache
    $scope.chgTache = function (id,user) {
        //$scope.ListProjet = [];
        //$scope.ListClient = [];
        //$scope.ListTache = [];
        $scope.ListTemps = [];
        $scope.ListSearchRPage = 0;
        if (id >= 0) {
            $scope.getTempsTache($scope.ListTache[id]._id, user, 0);
        } else {
            $scope.getTempsTache(0, user, 0);
        };
        
    };
    //-- getTemps
    $scope.getTempsTache = function (tache, user, page) {
        //console.log(tache);
        $scope.ListTemps = [];
        if (user) {
            if (tache == 0) {
                var msg = { 'type': 'Temps', 'action': 'list', 'data': {'IDUser': user, 'page': page } };
            } else {
                var msg = { 'type': 'Temps', 'action': 'list', 'data': { 'IDTache': tache, 'IDUser': user, 'page': page } };
            };

            
        } else {
            var msg = { 'type': 'Temps', 'action': 'list', 'data': { 'IDTache': tache, 'page': page } };
        };
        socket.emit("messageIN", { message: msg });
    };
    //-- PageTemps
    $scope.PageTempsTache = function (val, user,tache) {
        //$scope.searchResults = [];
        var nb = $scope.ListSearchRPage;
        if (val == '+') { nb += 1; };
        if (val == '-') { nb -= 1; };
        if (nb < 0) { nb = 0; };
        $scope.ListSearchRPage = nb;
        if (tache >= 0) {
            $scope.getTempsTache($scope.ListTache[tache]._id, user, nb);
        } else {
            $scope.getTempsTache(0, user, nb);
        };
        
    }
    // closeTemps
    $scope.closeTemps = function () {
       // console.log('fermeture');
        $scope.temps._id = '';
        $scope.temps.IDUtilisateur = '';
        $scope.temps.DateDebut = '';
        $scope.temps.HeureDebut = '';
        $scope.temps.HeureFin = '';
        $scope.temps.Commentaire = '';
        $scope.temps.IDTache = '';
        $scope.temps.IDClient = '';
        $scope.temps.IDProjet = '';
        document.getElementById('popTemps').style.display = 'none';
    };
    //-- openTemps
    $scope.openTemps = function (id) {

        if (id >= 0) {
            //console.log($scope.ListTache);
            if ($scope.ListTache.length <= 1) {
                $scope.ListTache = [];
                $scope.ListTache.push({ '_id': $scope.ListTemps[id].IDTache, 'Nom': $scope.ListTemps[id].Tache });
                //console.log($scope.ListTache);
            };
            //console.log($scope.ListProjet);
            if ($scope.ListProjet.length <= 1) {
                $scope.ListProjet = [];
                $scope.ListProjet.push({ '_id': $scope.ListTemps[id].IDProjet, 'Nom': $scope.ListTemps[id].Projet });
                //console.log($scope.ListProjet);
            };
            $scope.temps._id = $scope.ListTemps[id]._id;
            $scope.temps.IDUtilisateur = $scope.ListTemps[id].IDUtilisateur;
            $scope.temps.DateDebut = $scope.ListTemps[id].DateDebut;
            $scope.temps.HeureDebut = $scope.ListTemps[id].HeureDebut;
            $scope.temps.HeureFin = $scope.ListTemps[id].HeureFin;
            $scope.temps.Commentaire = $scope.ListTemps[id].Commentaire;
            $scope.temps.IDTache = $scope.ListTemps[id].IDTache;
            $scope.temps.IDClient = $scope.ListTemps[id].IDClient;
            $scope.temps.IDProjet = $scope.ListTemps[id].IDProjet;

            //var msg = { 'type': 'Temps', 'action': 'get', 'data': { '_id': $scope.ListTemps[id]._id } };
            //socket.emit("messageIN", { message: msg });
           //document.getElementById('popTemps').style.display = 'block';
        } else {
            //console.log('ouverture');
            $scope.temps._id = '';
            $scope.temps.IDUtilisateur = $scope.UserTemps;
            $scope.temps.DateDebut = (new Date().getDate()) + '/' + (new Date().getMonth()) + '/' + (new Date().getFullYear()); 
            $scope.temps.HeureDebut = (new Date().getHours()) + ':' + (new Date().getMinutes());
            $scope.temps.HeureFin = '';
            $scope.temps.Commentaire = '';
            $scope.temps.IDTache = $scope.ListTache[$scope.idTache]._id;
            $scope.temps.IDClient = $scope.ListClient[$scope.idClient]._id; 
            $scope.temps.IDProjet = $scope.ListProjet[$scope.idProjet]._id;
            //$scope.$apply();
        };
        //$scope.$apply();
        document.getElementById('popTemps').style.display = 'block';
    };
    //-- AjouterTemps
    $scope.AjouterTemps = function (temps) {
        $scope.ListTemps = [];
        var msg = { 'type': 'Temps', 'action': 'add', 'data': temps };
        socket.emit("messageIN", { message: msg });
    };
    //-- chgUserTemps
    $scope.chgUserTemps = function (userid) {
        $scope.ListSearchRPage = 0; 
        $scope.getTemps(userid, 0);
    };
    //-- getTemps
    $scope.getTemps = function (userid, page) {
        $scope.SuiviTacheList = [];
        var msg = { 'type': 'SuiviPerso', 'action': 'list', 'data': { 'userid': userid, 'page': page } };
        socket.emit("messageIN", { message: msg });
    };
    //-- PageTemps
    $scope.PageTemps = function (val,userid) {
        //$scope.searchResults = [];
        var nb = $scope.ListSearchRPage;
        if (val == '+') { nb += 1; };
        if (val == '-') { nb -= 1; };
        if (nb < 0) { nb = 0; };
        $scope.ListSearchRPage = nb;
        $scope.getTemps(userid, nb);

    }


    
    //-- getUserTask
    $scope.getUserTask = function (userid) {
        var msg = { 'type': 'TodoApp', 'action': 'list', 'data': { 'userid': userid } };
        socket.emit("messageIN", { message: msg });
    };
    //-- GererIdx
    $scope.GererIdx = function () {
        var msg = { 'type': 'ArchiveDoc', 'action': 'GererIdx', 'data': { 'ArcDocID': angular.element(ArcDocID).val() } };
        socket.emit("messageIN", { message: msg });
        $scope.MngIdx = true;
    };
    //-- connexion
    $scope.connexion = function (usr,pwd) {
        var msg = { 'type': 'Session', 'action': 'connect', 'data': { 'user': usr ,'passw': pwd,'UserSessionId':angular.element(UserSessId).val()} };
        socket.emit("messageIN", { message: msg });
        //window.location.href = '/temps';
    };
    //-- ArcDocSave
    $scope.ArcDocSave = function () {
        //console.log('Envoi de :', $scope.files[0]);
        delivery.send($scope.files[0]);
    };
    //---
    $scope.setFiles = function (element) {
        $scope.$apply(function ($scope) {
            //console.log('files:', element.files);
            // Turn the FileList object into an Array
            $scope.files = []
            for (var i = 0; i < element.files.length; i++) {
                $scope.files.push(element.files[i])
            }
            //$scope.progressVisible = false
        });
    };
    //-- supprimer ligne indexe
    $scope.dltIdxRow = function (idxRow) {
        //console.log(idxRow);

        $scope.searchCriteres.splice(parseInt(idxRow),1);
    }
    //-- Ajouter ligne indexe
    $scope.addIdxRow = function () {
        //var keys = Object.keys(Arc);
        var idxIsValid = true;
        if (!$scope.IndexNameList || !$scope.IndexVal) { idxIsValid = false; };
        if (idxIsValid) {
            $scope.searchCriteres.forEach(function (k) {
                if ($scope.IndexNameList == k.IndexName) { idxIsValid = false; };
            });
        };
        if (idxIsValid) {
            var idxc = {
                'IndexName': $scope.IndexNameList,
                'IndexVal': $scope.IndexVal
            };
            $scope.searchCriteres.push(idxc);
            $scope.IndexNameList = '';
            $scope.IndexVal = '';
            
        } else {
            //alert('Le critere "' + $scope.IndexNameList + '" existe deja pour ce document.');
        };
        
    }

    //-- ArcIdxSave
    $scope.ArcIdxSave = function () {
        var msg = { 'type': 'ArchiveDoc', 'action': 'ArcIdxSave', 'data': { 'ArcDocID': angular.element(ArcDocID).val(), 'ArcDocFName': angular.element(ArcDocFName).val(), 'ArcDocIdx': $scope.searchCriteres} };
        socket.emit("messageIN", { message: msg });
    };

	//-- PageArchive
	$scope.PageRecherche = function(val) {
		$scope.searchResults = [];
		var nb = $scope.ListSearchRPage;
		if(val == '+'){nb += 1;}; 
		if(val == '-'){nb -= 1;}; 
		if(nb < 0){nb = 0;}; 
		$scope.ListSearchRPage = nb
		$scope.ioDialog('recherche');
		
	}
	//-- getUser
	$scope.UptListIdx = function() {
		var msg = {'type':'IndexTable','action':'Upt','data':{'_id':'0'}};
		socket.emit("messageIN", {message : msg});
		//socket.emit("messageIN", {message : {'type':'IndexTable','action':'init'}});
	};
	//-- getUser
	$scope.getForm = function(type,val) {
		if(type == 'user'){
			//--
			var msg = {'type':'user','action':'get','data':{'_id':val}};
			socket.emit("messageIN", {message : msg});
		};
		if(type == 'article'){
			//--
			var msg = {'type':'article','action':'get','data':{'_id':val}};
			socket.emit("messageIN", {message : msg});
		};
		if(type == 'boutique'){
			//--
			var msg = {'type':'boutique','action':'get','data':{'_id':val}};
			socket.emit("messageIN", {message : msg});
		};
		if(type == 'parametre'){
			//--
			var msg = {'type':'parametre','action':'get','data':{'_id':val}};
			socket.emit("messageIN", {message : msg});
		};
		if(type == 'IndexTable'){
			//--
			//console.log($scope.IndexSeek);
			var msg = {'type':'IndexTable','action':'get','data':{'_id':val}};
			socket.emit("messageIN", {message : msg});
		};
	};
	
	$scope.vider = function(zone) {
		if(zone == 'IndexVal'){
			$scope.blockIdx = true;
			$scope.IndexVal = '';
		}
		//$scope.$apply();
	}
	//-- resetUser
	$scope.resetForm = function(type) {
		if(type == 'user'){
			$scope.usr_nom = '';
			$scope.usr_prenom = '';
			$scope.usr_mail = '';
			$scope.usr_telephone = '';
			$scope.usr_codepostal = '';
			$scope.usr_adresse = '';
			$scope.usr_description = '';
			$scope.usr_type = '';
			$scope.userSeek = '';
			$scope.usr_id = null;//'newId';
		};

		if(type == 'parametre'){
			$scope.par_nom = '';
			$scope.par_group = '';
			$scope.par_valeur = '';
			$scope.parametreSeek = '';
			$scope.par_id = null;//'newId';
		};
		if(type == 'IndexTable'){
			$scope.index_nom = '';
			$scope.index_group = '';
			$scope.indexSeek = '';
			$scope.index_id = null;//'newId';
		};
		$scope.$apply();
	};
	//-- deleteFrom
	$scope.deleteFrom = function(type,val) {
		if(type == 'user'){
			//--
			var msg = {'type':'user','action':'delete','data':{'_id':val}};
			socket.emit("messageIN", {message : msg});
			socket.emit("messageIN", {message : {'type':'user','action':'list'}});
			$scope.resetForm('user');
		};

		if(type == 'parametre'){
			//--
			var msg = {'type':'parametre','action':'delete','data':{'_id':val}};
			socket.emit("messageIN", {message : msg});
			socket.emit("messageIN", {message : {'type':'parametre','action':'list'}});
			$scope.resetForm('parametre');
		};
		if(type == 'IndexTable'){
			//--
			var msg = {'type':'IndexTable','action':'delete','data':{'_id':val}};
			socket.emit("messageIN", {message : msg});
			socket.emit("messageIN", {message : {'type':'IndexTable','action':'list'}});
			$scope.resetForm('IndexTable');
		};
		$scope.$apply();
	};
	//-- ioDialog idUser
	$scope.majIdxValList = function(type) {
		var diag = false;
		if(type == 'assist'){
			$scope.IndexValLists = [];
            var dta = {
                'index': $scope.IndexNameList,
                'valeur': $scope.IndexVal,
            };
			var msg = {
				'type':'SunArchives',
				'action':'assist',
				'data':dta
			};
			diag = true;
		};
		if(diag){
			socket.emit("messageIN", { message : msg});
		};
	}
	//-- ioDialog idUser
	$scope.ioDialog = function(type) {
		var diag = false;

		if(type == 'recherche'){
			$scope.searchResults = [];
			//$scope.ListSearchRPage = 0;

			var msg = {
				'type':'SunArchives',
				'action':'search',
				'page':$scope.ListSearchRPage,
				'limit':10,
                'data': $scope.searchCriteres
			};
			diag = true;
		};
		if(type == 'parametre'){
			var msg = {
				'type':'parametre',
				'action':'create',
				'data':{
					'nom':$scope.par_nom,
					'group':$scope.par_group,
					'valeur':$scope.par_valeur,
					'_id':$scope.par_id
				}
			};
			diag = true;
		};
		if(type == 'IndexTable'){
			var msg = {
				'type':'IndexTable',
				'action':'create',
				'data':{
					'index':$scope.index_nom,
					'group':$scope.index_group,
					'_id':$scope.index_id
				}
			};
			diag = true;
		};
		if(type == 'user'){
			var msg = {
				'type':'user',
				'action':'create',
				'data':{
					'nom':$scope.usr_nom,
					'prenom':$scope.usr_prenom,
					'mail':$scope.usr_mail,
					'telephone':$scope.usr_telephone,
					'codepostal':$scope.usr_codepostal,
					'adresse':$scope.usr_adresse,
					'description':$scope.usr_description,
					'type':$scope.usr_type,
					'_id':$scope.usr_id
				}
			};
			diag = true;
		};

		if(diag){
			socket.emit("messageIN", { message : msg});
			if(type == 'parametre'){
				socket.emit("messageIN", {message : {'type':'parametre','action':'init'}});
			}
			if(type == 'IndexTable'){
				socket.emit("messageIN", {message : {'type':'IndexTable','action':'init'}});
			}
		};
	};
	       
}]);
