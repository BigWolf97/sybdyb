
        
var SybDybAppVw = angular.module('SybDybAppVw', ["ngStorage"]);

SybDybAppVw.controller('firstCtrl', ['$scope', '$document', '$localStorage', function ($scope, $document, $localStorage) {
    //$scope.sValue = 'OK';
    //$scope.title = 'Paramétrage';
    var delivery;

    var socket = io();
    socket.on('connect', function () {
        
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
                    console.log(msg.baseUrl);
                    window.location.href = msg.baseUrl ;
                };
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
        address : '',
        originalUrl:''
    };
    //-- connexion
    $scope.connexion = function (usr,pwd) {
        var msg = { 'type': 'Session', 'action': 'connect', 'data': { 'user': usr ,'passw': pwd,'UserSessionId':angular.element(UserSessId).val(),'originalUrl':angular.element(originalUrl).val()} };
        socket.emit("messageIN", { message: msg });
        //window.location.href = '/temps';
    };
    
	       
}]);
