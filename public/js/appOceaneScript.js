
        
var SybDybAppVw = angular.module('SybDybAppVw', ['ngSanitize']);

SybDybAppVw.controller('firstCtrl', ['$scope', '$document', function ($scope, $document) {
    // fonctions :
    $scope.SelectMenu = function (menu) {
        document.getElementById('MenuA').style.display = 'none';
        document.getElementById('MenuB').style.display = 'none';
        document.getElementById('MenuC').style.display = 'none';
        document.getElementById('MenuD').style.display = 'none';
        //--
        //console.log(menu);
        document.getElementById(menu).style.display = 'block';
    };
    $scope.closeProduit = function () {
        document.getElementById('popProduit').style.display = 'none';
    };
    $scope.openProduit = function (id) {
        $scope.idProduit = id;
        document.getElementById('popProduit').style.display = 'block';
    };
    
    // initialisation des variables 
    var d = new Date();
    
	$scope.DateDuJour = d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear();
    $scope.MenuAContent = {
        intro : 'Oceane Sofware SA, éditeur de la solution Pack Exploitation et Universal-Edition <br/>'+
        'Solution professionnelle pour l\'exploitation  et la gestion des documents et de l\'éditique.',
        corps : '<b>Oceane Software les solutions pour </b><br/><br/><p>Assurer la gestion de votre exploitation et de vos documents via une gamme de solutions logiciels puissantes, simples et efficaces.<br/>Vous accompagner par un service de et des prestations de qualité, tout au long de la mise en place de vos projets.</p><br/><br/><br/>'+
        '<b>Oceane Software vingt années de réussite de vos projets</b><br/><br/><p>Depuis plus de vingt ans, notre riche expérience en matière de gestion des documents d’entreprises et de l\'exploitation de la production informatique, et  également notre forte implantation dans tous types entreprises, nous ont permis de constituer un réel savoir-faire autour du métier de nos clients, ainsi qu’une grande connaissance des systèmes d’informations, et de production. <br/>Ces connaissances, constituent pour nous et donc pour vous, un réel avantage dans la mise en œuvre et la réussite de votre projet.</p>'
    };
    $scope.MenuBContent = {
        produits : [{titre:'La solution Universal-Edition ',detail:'<h4><b><u>SunSpool/400</u></b></h4><p>Architecture centralisée de la gestion des documents, et des centaines de fonctions de traitement des éditions</p></br><h4><b><u>SunSpool/Mapping</u></b></h4><p>Designer de Spools</p></br><h4><b><u>SunSpool/AnyWay</u></b></h4><p>Réception et envoi de documents et de spools par protocoles Pdf, Xml, Fcfc,PCl…</br>Module de compression intégré, pour optimiser les envois de flux sur les sites éloignés</p></br><h4><b><u>SunSpool/GED</u></b></h4><p>Gestion Electronique de Documents.</br>Ce pack complet ayant pour but, d\'automatiser et de gérer l\'ensemble du gapier et de la Gestion des flux de l\'Entreprise.</br>Traitement – Indexation – Stockage – Archivage – Impression – Mail – Fax – Scannérisation de documents externes….)</p>'},
        {titre:'La solution Intégral-Exploitation ',detail:'<h4><b><u>Sun/Automat</u></b></h4><p>Automate d\'exploitation natif AS/400, avec console de surveillance multi-machine</p><h4><b><u>Sun/Save</u></b></h4><p>Gestionnaire de sauvegarde</p><h4><b><u>Sun/Alert</u></b></h4><p>Gestion des surveillances et alertes</p>'}],
        intro : '',
        corps : '<h3><b>Gamme de produits & descriptifs</b></h3><br/><p>Pour répondre à vos exigences, OCEANE SOFWARE  propose une gamme homogène et cohérente de logiciels, avec un dénominateur commun : la fiabilité.<br/><br/>Nos logiciels, conçus dans notre Laboratoire, sont aisés à installer et simples à utiliser. <br/>De ce fait, ils peuvent évoluer rapidement pour s\'adapter à de nouveaux besoins.<br/><br/>Cette souplesse, garantit la pérennité de l\'exploitation de nos clients, et permet d\'optimiser sans cesse l\'utilisation de l\'AS/400et Windows.<br/>Disponibles dans le monde entier, ils sont : modulables, multilingues, interfaçables.<br/><br/>Vous trouverez ci-après, le Descriptif de notre Gamme de produits destinée à l\'Automatisation de l\'Exploitation, et à la Gestion des Editions :</p>'
    };
    $scope.MenuCContent = {
        intro : '',
        corps : [
            {titre:'Prestations de services',detail:'<p>Toutes nos prestations peuvent avoir lieu sur votre site ou en nos locaux.</br></br>Les prestations de fabrication, paramétrage, programmation,…</br>effectuées en nos locaux  bénéficient d\'un taux de facturation préférentiel.</br></br>La nature des prestations peut être de type :</br><ul><li>Installation</li><li>Mise en œuvre et paramétrage</li><li>Reprises</li><li>Formation et transfert de compétences</li><li>Accompagnement</li><li>Paramétrage à la demande</li><li>Développement de courrier</li><li>Ecriture de connecteurs</li><li>Conduite, suivi et mise en œuvre complète du projet</li><li>Etc.</li></ul></br>Cette liste n\'est pas exhaustive. </p>'},
            {titre:'La maintenance',detail:'<p>La maintenance ne doit pas être confondue avec une prestation de services, ou de formation.</br></br>Elle sert à la correction d\'anomalies ou de dysfonctionnements avérés du produit.</br></br>La maintenance donne accès à :</br><ul><li>Installation</li><li>Support via hot-line, telephone, mail, …</li><li>La télémaintenance</li><li>L\'envoi de correctifs</li><li>Le téléchargement par le site web</li><li>Les mises à jour de nouvelles versions</li><li>numéro téléphone et mail, d\'urgence, pour travaux ponctuels à risque, hors plages horaires Hot line (migration, chg version…)</li></ul></br>La Hot Line, composée de techniciens compétents, est ouverte de 9h à 13h et 14h30 à 18h du lundi au vendredi, heures et dates métropole.</br></br>Le délai de prise en compte des appels est de 1 heure.</br></br><La résolution d\'incidents bloquants est effectuée dans les meilleurs délais, et devient une tâche prioritaire pour l\'entreprise.</p>'},
            {titre:'Le SSA : Service Support et Assistance',detail:'<p>Le SSA permet de répondre aux besoins récurrents et continus, de suivis et de prestations diverses des établissements. </br>Celui-ci peut se décliner sous toutes les formes de service que nous proposons, excepté la formation et la maintenance,  et donc de bénéficier des remises associées.</br></br>La formule est la suivante :</br><ul><li>Un crédit commandé et fixé d\'avance d\'un nombre de jours par établissement, et par an</li></ul></br>Permettant de :</br><ul><li>bénéficier de facto de remises plus intéressantes,</li><li>mieux planifier les demandes</li><li>mettre en place un process de formalisation des demandes, de suivi et d\'avancement des travaux.</li><li>obtenir une plus grande réactivité.</li><li>être prioritaire sur les autres demandes</li></ul></p>'}
        ]
    };
    $scope.MenuDContent = {
        intro : '',
        corps : '<h3><b>Nous contactez</b></h3><br/><br/><b>Téléphone :</b> +33 (0) 1 49 41 01 01<br/><br/><b>Télécopie :</b> +33 (0) 1 49 41 21 01<br/><br/><p><b>Adresse postale :</b> 7 rue Maurice Dudragne 94350 Villiers sur Marne, France</p><br/><b> Messagerie électronique :</b><br/></p> - Informations commerciales : service@oceane-software.fr<br/> - Support client : support@oceane-software.fr</p><br/><br/><h3><b>Téléchargement</b></h3><br/><b>Assistance On Line :</b> <a title="AppAssist" href="http://sybdyb.eu-4.evennode.com/archives/59ab21f74ada470014c71c84">Application assistance</a>'
    };
    $scope.idProduit = 0;
    //document.getElementById('popProduit').style.display = 'block';
}]);
