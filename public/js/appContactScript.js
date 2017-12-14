
        
var SybDybAppVw = angular.module('SybDybAppVw', ["ngStorage"]);

SybDybAppVw.controller('firstCtrl', ['$scope', '$document', '$localStorage', function ($scope, $document, $localStorage) {
    //$scope.sValue = 'OK';
    //$scope.title = 'Paramétrage';
    var delivery;

    var socket = io();
    socket.on('connect', function () {
        $scope.getContact(0);
    });
    socket.on("messageOUT", function(data) {
        var msg = data["message"];
        //-----
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
		$scope.$apply();
	});
	
	// initialisation des variables 
	var d = new Date();
	$scope.DateDuJour = d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear();
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
    $scope.ListAgence = [
		{'_id':'Oceane','Nom':'Oceane'}
    ];

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
        var msg = { 'type': 'Contact', 'action': 'list', 'data': {'page': page,'UserSession':$localStorage.UserConnInfo } };
        socket.emit("messageIN", { message: msg });
    };	       
}]);
