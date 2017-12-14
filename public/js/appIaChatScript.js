
        
var SybDybAppVw = angular.module('SybDybAppVw', ["ngStorage"]);

SybDybAppVw.controller('firstCtrl', ['$scope', '$document', '$localStorage', 
    function ($scope, $document, $localStorage) {
        //$scope.sValue = 'OK';
        //$scope.title = 'Paramétrage';
        var delivery;

        var socket = io();
        socket.on('connect', function () {
            socket.emit("messageIN", { message: { 'type': 'user', 'action': 'list', 'data': {UserSession:$localStorage.UserConnInfo} } });
            socket.emit("messageIN", { message: { 'type': 'iaTchat', 'action': 'init', 'data': {UserSession:$localStorage.UserConnInfo} } });
        });
        socket.on("messageOUT", function(data) {
            var msg = data["message"];
            //-----
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
                };
            }
            //-----
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
        $scope.iaTchat = [];
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

        //document.onkeyup = applyKey;

        //-- init application
        
        //-- iaTchat
        $scope.AddiaTchat = function (iaTchat) {
            //$scope.iaTchat = [];
            d = new Date(iaTchat.date);
            var tTabA = [{user:iaTchat.user,texte:iaTchat.texte,date:d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear(),time:d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()}];
            var tTabB = $scope.iaTchat;
            var tTabC = [];
            if(tTabB.length > 1 ){
                if(tTabB[0].date != tTabA[0].date ){
                    //console.log(tTabB[0]);
                    var tTabD = [{user:"",texte:"Conversation pour la journée du "+tTabB[0].date,date:"00"+"/"+"00"+"/"+"0000",time:tTabB[0].date}];
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
	       
    }
]);
