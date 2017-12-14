
        
var SybDybAppVw = angular.module('SybDybAppVw', ["ngStorage"]);

SybDybAppVw.controller('firstCtrl', ['$scope', '$document', '$localStorage', function ($scope, $document, $localStorage) {
    //$scope.sValue = 'OK';
    //$scope.title = 'Paramétrage';
    var delivery;

    var socket = io();
    socket.on('connect', function () {
		socket.emit("messageIN", { message: { 'type': 'parametre', 'action': 'init', 'data': {UserSession:$localStorage.UserConnInfo} } });
		socket.emit("messageIN", { message: { 'type': 'user', 'action': 'list', 'data': {UserSession:$localStorage.UserConnInfo} } });
    });
    socket.on("messageOUT", function(data) {
        var msg = data["message"];
        //-----
		if(msg.type == 'parametre'){
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
				socket.emit("messageIN", { message: { 'type': 'parametre', 'action': 'init', 'data': {UserSession:$localStorage.UserConnInfo} } });
				//socket.emit("messageIN", {message : {'type':'parametre','action':'list'}}); // redondance?
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
				socket.emit("messageIN", {message : {'type':'user','action':'list', 'data': {UserSession:$localStorage.UserConnInfo}}});
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
	$scope.ListUtilisateur = [];
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
    //-- chgUtilisateur
    $scope.chgUtilisateur = function (id) {
        //$scope.ListUtilisateur = [];
        var msg = { 'type': 'user', 'action': 'get', 'data': { '_id': id,UserSession:$localStorage.UserConnInfo} };
        socket.emit("messageIN", { message: msg });
        document.getElementById('popUtilisateur').style.display = 'block';
        //socket.emit("messageIN", { message: { 'type': 'user', 'action': 'list', 'data': {UserSession:$localStorage.UserConnInfo} } });

    };
    
    //-- AjouterUtilisateur
    $scope.AjouterUtilisateur = function (usr) {
        //$scope.ListUtilisateur = [];
		usr.UserSession=$localStorage.UserConnInfo;
		//console.log(usr);
        var msg = { 'type': 'user', 'action': 'add', 'data': usr };
        socket.emit("messageIN", { message: msg });
        document.getElementById('popUtilisateur').style.display = '';
        if(usr._id){

        }else{
            socket.emit("messageIN", { message: { 'type': 'user', 'action': 'list', 'data': {UserSession:$localStorage.UserConnInfo} } });
            //document.getElementById('popUtilisateur').style.display = '';
        }
        
	};
	
    $scope.getForm = function(type,val) {
		if(type == 'parametre'){
			//--
			var msg = {'type':'parametre','action':'get','data':{'_id':val,'UserSession':$localStorage.UserConnInfo}};
			socket.emit("messageIN", {message : msg});
		};
	};
    $scope.resetForm = function(type) {
		if(type == 'parametre'){
			$scope.par_nom = '';
			$scope.par_group = '';
			$scope.par_valeur = '';
			$scope.parametreSeek = '';
			$scope.par_id = null;//'newId';
		};
		$scope.$apply();
	};
	//-- deleteFrom
	$scope.deleteFrom = function(type,val) {
		if(type == 'parametre'){
			//--
			var msg = {'type':'parametre','action':'delete','data':{'_id':val,'UserSession':$localStorage.UserConnInfo}};
			socket.emit("messageIN", {message : msg});
			socket.emit("messageIN", {message : {'type':'parametre','action':'init','data':{'UserSession':$localStorage.UserConnInfo}}});
			$scope.resetForm('parametre');
		};
		$scope.$apply();
	};
	//-- ioDialog idUser
	$scope.ioDialog = function(type) {
		var diag = false;
		if(type == 'parametre'){
			var msg = {
				'type':'parametre',
				'action':'create',
				'data':{
					'nom':$scope.par_nom,
					'group':$scope.par_group,
					'valeur':$scope.par_valeur,
                    '_id':$scope.par_id,
                    'UserSession':$localStorage.UserConnInfo
				}
            };
            socket.emit("messageIN", { message : msg});
		};
	};
	       
}]);
